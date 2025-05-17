"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { 
  collection, addDoc, getDocs, serverTimestamp, 
  doc, updateDoc, getDoc, onSnapshot, 
  Timestamp
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Review {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  productId: string;
  productName?: string;
  reviewText: string;
  rating: number;
  adminResponse?: string;
  createdAt?: Timestamp;
}

const Reviews = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [adminResponses, setAdminResponses] = useState<{ [key: string]: string }>({});
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
      try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkIfAdmin();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          name: doc.data().name,
          imageUrl: doc.data().imageUrl 
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const reviewList: Review[] = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        const product = products.find((p) => p.id === reviewData.productId);
        
        return {
          ...reviewData,
          id: doc.id,
          productName: product?.name || "Unknown Product",
        };
      });
      setReviews(reviewList);
    });

    return () => unsubscribe();
  }, [products]);

  const submitReview = async () => {
    if (!user || !selectedProduct || !reviewText) {
      toast({ description: "Please select a product and write your review." });
      return;
    }
    
    try {
      const selectedProd = products.find(p => p.id === selectedProduct);
      
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0],
        productId: selectedProduct,
        productName: selectedProd?.name,
        reviewText,
        rating,
        adminResponse: "",
        createdAt: serverTimestamp(),
      });
      
      setReviewText("");
      setRating(5);
      setSelectedProduct("");
      toast({ description: "Thank you for your review!" });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({ description: "Failed to submit review.", variant: "destructive" });
    }
  };

  const handleAdminResponse = async (reviewId: string) => {
    if (!isAdmin || !adminResponses[reviewId]) {
      toast({ description: "Response cannot be empty." });
      return;
    }

    try {
      await updateDoc(doc(db, "reviews", reviewId), {
        adminResponse: adminResponses[reviewId],
      });
      toast({ description: "Response submitted!" });
    } catch (error) {
      console.error("Error updating response:", error);
      toast({ description: "Failed to submit response.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto -p-2 md:p-6 font-poppins">
      <div className="rounded-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Product Reviews</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Share Your Experience</h2>
            <p className="text-gray-600 mb-4">
              We value your feedback about our beekeeping products. Help other customers make informed decisions.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center">
                          {product.imageUrl && (
                            <Image
                              src={product.imageUrl} 
                              alt={product.name}
                              width={200}
                              height={200}
                              className="w-8 h-8 object-cover rounded-md mr-2"
                            />
                          )}
                          {product.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 cursor-pointer ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button 
                onClick={submitReview}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border p-6">
        <h2 className="text-2xl font-bold text-yellow-700 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length > 0 ? (
          <>
            <div className="space-y-6">
              {reviews.slice(0, showAll ? reviews.length : 3).map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {review.userName || review.userEmail?.split('@')[0] || 'Anonymous'}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {review.createdAt?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                      {review.productName}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700 first-letter-uppercase">{review.reviewText}</p>

                  {review.adminResponse && (
                    <div className="mt-4 pl-4 border-l-2 border-yellow-200">
                      <p className="text-sm font-medium text-gray-900">{"Admin's"} Response:</p>
                      <p className="text-sm text-gray-600 mt-1 first-letter-uppercase">{review.adminResponse}</p>
                    </div>
                  )}

                  {isAdmin && !review.adminResponse && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Respond to this review..."
                        value={adminResponses[review.id] || ""}
                        onChange={(e) => setAdminResponses(prev => ({
                          ...prev,
                          [review.id]: e.target.value
                        }))}
                        className="text-sm"
                      />
                      <Button
                        onClick={() => handleAdminResponse(review.id)}
                        className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                        size="sm"
                      >
                        Post Response
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="ghost"
                className="mt-6 text-yellow-600 hover:bg-yellow-50 w-full"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show All Reviews
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
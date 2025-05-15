"use client";

import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 font-poppins">
      <h1 className="text-3xl font-bold text-center text-yellow-700 mb-6">
        Terms and Conditions
      </h1>

      <p className="mb-4">
        Welcome to KMK Beehives! These Terms and Conditions outline the rules and
        regulations for the use of our website and the purchase of our
        beekeeping products and services.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing this website and purchasing from KMK Beehives, you agree to be
        bound by these terms. If you do not agree with any part of the terms, you
        should not use our services.
      </p>

      <h2 className="text-xl font-semibold mt-4">2. User Accounts</h2>
      <p className="mb-4">
        To place an order or access certain features, you may need to create an
        account. You are responsible for maintaining the security of your login
        information and for all activity under your account.
      </p>

      <h2 className="text-xl font-semibold mt-4">3. Orders and Payments</h2>
      <p className="mb-4">
        All orders are subject to availability and confirmation. Payments must be
        made in full through the available payment methods. We accept M-Pesa and
        other digital payment options. Once an order is confirmed, cancellations
        or changes may not be possible.
      </p>

      <h2 className="text-xl font-semibold mt-4">4. Shipping and Delivery</h2>
      <p className="mb-4">
        We deliver products across Kenya. Delivery timelines may vary depending on
        your location. KMK Beehives is not liable for delays caused by third-party
        couriers or force majeure events.
      </p>

      <h2 className="text-xl font-semibold mt-4">5. Prohibited Use</h2>
      <p className="mb-4">
        You agree not to use our website or products for any illegal or
        unauthorized purpose, including but not limited to fraudulent activities or
        the infringement of intellectual property.
      </p>

      <h2 className="text-xl font-semibold mt-4">6. Returns and Refunds</h2>
      <p className="mb-4">
        If a product arrives damaged or defective, please contact us within 48
        hours. Eligible returns must be unused and in original packaging. Refunds
        or replacements are issued based on our inspection and discretion.
      </p>

      <h2 className="text-xl font-semibold mt-4">7. Modifications</h2>
      <p className="mb-4">
        KMK Beehives reserves the right to update these terms at any time. Continued
        use of our website and services after such changes implies your acceptance
        of the updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-4">8. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms and Conditions, please{" "}
        <a href="tel:+254798050462" className="text-yellow-700 underline">
          contact us
        </a>{" "}
        or email us at support@kmkbeehives.com.
      </p>
    </div>
  );
};

export default TermsAndConditions;

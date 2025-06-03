 const services = [
    {
       id: "Hive-Installation",
      title: "Hive Installation",
      description:
        "We offer professional hive installation services to ensure your beehives are set up in the best location for optimal productivity and safety. Whether it’s a Langstroth, Kenyan Top Bar, or custom hive, our experts handle everything from transport to final positioning.",
      icon: "🍯",
    },
    {
       id: "Hive-Installation",
      title: "Hive Installation",
      description:
        "Our team provides clean and efficient honey harvesting using safe, non-invasive methods that preserve colony health and maximize yield. We also offer filtering, packaging, and labeling support for your honey products.",
      icon: "🐝",
    },
    {
      id: "Bee-Colony-Transfer",
      title: "Bee Colony Transfer",
      description:
        "Need to move your bees into a new hive? We safely transfer colonies between hives or from natural habitats into managed hives while protecting both bees and handlers.",
      icon: "🔄",
    },
    {
      id: "Hive-Inspection",
      title: "Hive Inspection & Maintenance",
      description:
        "We conduct regular hive inspections to monitor colony health, check for pests or diseases, and perform maintenance like cleaning, repairing, or re-waxing frames. Our goal is to keep your bees thriving all year round.",
      icon: "🔍",
    },
    {
      id: "Beekeeping-Training",
      title: "Beekeeping Training & Consultation",
      description:
        "New to beekeeping? We offer hands-on training, workshops, and personalized consultations to get you started and guide you through every stage of your beekeeping journey.",
      icon: "📚",
    },
    {
      id: "Bee-Removal",
      title: "Bee Removal (Ethical Relocation)",
      description:
        "If you have a wild bee colony on your property, we offer ethical and eco-friendly bee removal services to relocate them safely to a managed hive environment.",
      icon: "🚚",
    },
  ];


export async function generateStaticParams() {
  return services.map((service) => ({
    serviceId: service.id,
  }));
}

const ServiceDetailPage = ({ params }: { params: { serviceId: string } }) => {
  const service = services.find((s) => s.id === params.serviceId);
  console.log(service)

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-6xl mb-6">{service.icon}</div>
        <h1 className="text-4xl font-bold text-yellow-700 mb-6">
          {service.title}
        </h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">{service.description}</p>
          
          {/* Add more detailed content here */}
          <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
            <p>More detailed information about {service.title} would go here.</p>
            <p>You could add pricing, process details, FAQs, etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
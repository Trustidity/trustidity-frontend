// export function StatsSection() {
//   const stats = [
//     { label: "Institutions Connected", value: "500+" },
//     { label: "Verifications Processed", value: "1M+" },
//     { label: "Countries Served", value: "50+" },
//     { label: "Fraud Cases Prevented", value: "10K+" },
//   ]

//   return (
//     <section className="py-20">
//       <div className="container">
//         <div className="mx-auto max-w-2xl text-center mb-16">
//           <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Impact</h2>
//           <p className="mt-4 text-lg text-muted-foreground">
//             Numbers that demonstrate our commitment to building a more trustworthy world.
//           </p>
//         </div>

//         <div className="mx-auto max-w-5xl">
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//             {stats.map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
//                 <div className="text-muted-foreground">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

export function StatsSection() {
  const stats = [
    { label: "Institutions Engaged", value: "In Progress" },
    { label: "Verifications Platform", value: "Launching Soon" },
    { label: "Regions Targeted", value: "Global Focus" },
    { label: "Goal", value: "Building Digital Trust" },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Vision
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're laying the foundation for a trusted global verification
            ecosystem — built on transparency, innovation, and integrity.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import PageHero from "@/components/PageHero";
import CustomerExperience from "@/components/CustomerExperience";

export const dynamic = "force-dynamic";

export default async function ExperienciasPage() {
  
  // DATOS FIJOS TEMPORALES
  const allChats = [
    { 
      platform: "whatsapp", 
      imageUrl: "https://i.ibb.co/0VrDt7H2/Whats-App-Image-2026-04-20-at-1-07-00-AM.jpg" 
    },
    { 
      platform: "whatsapp", 
      imageUrl: "https://i.ibb.co/q3wXYm1f/Whats-App-Image-2026-04-20-at-1-06-11-AM.jpg" 
    },
    { 
      platform: "whatsapp", 
      imageUrl: "https://i.ibb.co/DHTs32Y5/Whats-App-Image-2026-04-20-at-1-05-12-AM.jpg" 
    },
    { 
      platform: "whatsapp", 
      imageUrl: "https://i.ibb.co/0xytxyC/Whats-App-Image-2026-04-20-at-1-05-12-AM-6.jpg" 
    },
    { 
      platform: "whatsapp", 
      imageUrl: "https://i.ibb.co/Mkq0m4Y9/Whats-App-Image-2026-04-20-at-1-05-12-AM-1.jpg" 
    }
  ];

  // ¡AQUÍ ESTABA EL ERROR! Cambiamos homeComments por allComments
  const allComments = [
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/GvYTM3tR/Screenshot-2.png" 
    },
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/ZRmvYJWM/Screenshot-3.png" 
    },
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/GQbh2M1P/Screenshot-4.png" 
    },
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/vvvn7R3b/Screenshot-5.png" 
    },
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/p6hpFmNB/Screenshot-6.png" 
    },
    { 
      platform: "instagram", 
      imageUrl: "https://i.ibb.co/ZpFD3trW/Screenshot-7.png" 
    }
  ];

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Comunidad"
        title="Experiencias GameOver"
        description="Lo que dicen nuestros clientes tras su instalación. Sin filtros, captures reales de nuestra atención diaria."
        primaryAction={{ href: "/contacto", label: "Sé el próximo" }}
        secondaryAction={{ href: "/", label: "Volver a la tienda" }}
      />

      {/* Aquí pasamos el array de allChats */}
      <CustomerExperience 
        title="Chats de Venta y Soporte"
        description="Capturas directas de nuestras conversaciones en WhatsApp."
        captures={allChats}
      />

      {/* Aquí pasamos el array de allComments que ahora sí coincide */}
      <CustomerExperience 
        title="Opiniones en Redes"
        description="Lo que nuestra comunidad comenta en Instagram y Facebook."
        captures={allComments}
      />
    </main>
  );
}
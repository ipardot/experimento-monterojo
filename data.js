/* =========================================================
   data.js - Contenido del experimento MonteRojo
   Edita aquí preguntas, caminos y perfiles.
   ========================================================= */

const INTRO_QUESTION = {
  text: "Imagina que estás mercando en el supermercado de tu preferencia, ya llevas varias cosas, estás mirando por los pasillos y llegas a la sección de snacks. ¿Con qué actitud exploras y observas los productos?",
  // Cada respuesta decide el camino. NO se muestra el nombre del camino en la tarjeta.
  answers: [
    { path: "purchase", text: "Vengo como con un antojo previo, pasé por el pasillo de snacks y decidí entrar para consultar los productos y ver qué hay." },
    { path: "space",    text: "Simplemente estaba pasando y me llamó la atención cómo se veían los productos y la disposición del espacio. Me entró por los ojos y decidí entrar al pasillo." },
    { path: "brand",    text: "Me generó curiosidad saber qué marcas o productos estaban disponibles en esta ocasión, siempre me gusta mirar qué está disponible por si encuentro algo que me llame la atención." }
  ]
};

/* Caminos: 3 subcategorías x 2 preguntas. Los códigos (SH01, EF02...) se guardan en Google Sheets. */
const PATHS = {
  purchase: {
    name: "Path to purchase",
    subcategories: [
      { name: "Motivaciones de compra", code: "SH01", questions: [
        { text: "Mientras ingresas al pasillo, ¿cuál es tu motivación para comprar un snack?",
          a: "Ya sé qué quiero desde antes, sé que me gusta y si lo encuentro me lo llevo rápido.",
          b: "Busco explorar, no quiero lo mismo de siempre y estoy dispuesto a probar algo nuevo." },
        { text: "¿Qué te orienta más para decidir entre productos?",
          a: "Me fijo más en el tipo de snack, papitas, platanitos, chicharrones, si son artesanales o no.",
          b: "La búsqueda de sabores distintos y exclusivos que puede que no encuentre en las marcas de siempre." }
      ]},
      { name: "Percepción de valor", code: "SH03", questions: [
        { text: "Cuando ves que un snack como MonteRojo cuesta más que los tradicionales, ¿qué hace que sientas que vale comprarlo?",
          a: "Siento que me estoy decidiendo por un mejor producto gracias a sus ingredientes reales, limpios y naturales.",
          b: "Lo veo como un gusto o capricho especial que vale la pena por su sabor y experiencia superior." },
        { text: "De lo que ves en el empaque, ¿qué te transmite mayor valor antes de tomar la decisión?",
          a: "Que resalte materias primas naturales y de calidad (como sal del Himalaya, aceite de oliva o yuca real).",
          b: "Que tenga un diseño cuidado, sobrio y que proyecte una identidad artesanal colombiana." }
      ]},
      { name: "Consideraciones y comparaciones", code: "PMV02", questions: [
        { text: "Cuando estás frente al estante comparando opciones de snacks, ¿cuál es tu primer filtro?",
          a: "Comparo entre paquetes ultraprocesados tradicionales frente a opciones de origen natural y proceso artesanal.",
          b: "Comparo entre marcas comerciales masivas de siempre frente a marcas locales e independientes." },
        { text: "Si vas a buscar la variedad de MonteRojo que querías y está agotada en la góndola, ¿qué haces?",
          a: "Reviso las otras opciones de la misma marca MonteRojo y me llevo otro sabor o presentación.",
          b: "Reviso los productos de al lado y pruebo otra marca del segmento artesanal o saludable." }
      ]}
    ],
    profiles: {
      A: {
        name: "El Comprador de Ruta Fija",
        text: "Llegas al pasillo con el mapa en la cabeza: sabes qué te gusta, qué ingredientes valoras y qué estás dispuesto a pagar por ellos. Para ti MonteRojo gana cuando demuestra, con materias primas reales y naturales, que es la elección más inteligente. Compras con rapidez y convicción."
      },
      B: {
        name: "El Explorador de Antojos",
        text: "El pasillo es tu territorio de descubrimiento: buscas sabores distintos, marcas locales e independientes y un buen motivo para salirte de la rutina. Pagas de buen grado por un gusto especial. Para ti MonteRojo es una experiencia que se compra con curiosidad, no con lista."
      },
      balanced: {
        name: "El Curioso con Criterio",
        text: "Eres un comprador híbrido: llevas una idea clara de lo que te gusta, pero te dejas tentar cuando algo nuevo lo merece. Equilibras ingredientes y capricho, marca conocida y marca local. MonteRojo te conquista cuando logra ser a la vez una apuesta segura y un pequeño descubrimiento."
      }
    }
  },

  space: {
    name: "Espacio físico",
    subcategories: [
      { name: "Presencia y disponibilidad", code: "EF01", questions: [
        { text: "Cuando buscas tu snack en el supermercado, ¿qué tan importante es para ti ver que tiene bastante presencia en la góndola?",
          a: "Muy importante; ver varios paquetes juntos me transmite confianza, frescura y siento que es una marca destacada.",
          b: "Poco importante; mientras esté el paquete que busco, me da igual qué espacio o inventario tenga en el estante." },
        { text: "Si vas al pasillo y notas que solo quedan 1 o 2 paquetes del snack que te gusta al fondo de la repisa, ¿qué piensas?",
          a: "Lo veo como un producto muy vendido y popular, así que aprovecho y me llevo el último antes de que se agote.",
          b: "Me genera duda sobre la rotación del producto y prefiero buscar otra opción que tenga más stock disponible." }
      ]},
      { name: "Posición y destacado visual", code: "EF02", questions: [
        { text: "Al recorrer el pasillo de snacks, ¿en qué altura del stand se fija tu mirada de forma natural?",
          a: "En las repisas superiores o a la altura de los ojos, es lo más cómodo para mí mientras estoy buscando.",
          b: "En las repisas medias o inferiores, suelo buscarlos en todos los stands para ver todas las opciones y precios." },
        { text: "Si una marca independiente como MonteRojo está ubicada en el centro del pasillo y a la vista en lugar del fondo del estante, ¿cómo influye en ti?",
          a: "Captura mi atención más fácilmente y me motiva a incluirlo en mi consideración de compra.",
          b: "No influye tanto; prefiero recorrer todo el pasillo completo antes de decidir qué llevar." }
      ]},
      { name: "Merchandising POP", code: "EF03", questions: [
        { text: "Cuando ves señalización en el estante (como un letrero que resalta \"100% Natural\" o \"Artesanal\"), ¿cómo reaccionas?",
          a: "Me ayuda a enfocar la mirada, me da curiosidad y me invita a tomar el empaque para leerlo.",
          b: "Siento que es sobrecarga visual y tiendo a ignorarlo para mirar directamente los productos." },
        { text: "Si encuentras los snacks de MonteRojo en un exhibidor especial fuera del pasillo (por ejemplo, en un mueble de madera cerca de las bebidas o la caja), ¿qué efecto tiene?",
          a: "Me antoja a una compra no planificada porque resalta la experiencia premium y la conveniencia.",
          b: "Prefiero ver los productos organizados dentro de su pasillo habitual para comparar con las demás opciones." }
      ]}
    ],
    profiles: {
      A: {
        name: "El Cazador de Vitrinas",
        text: "Tu mirada es la que decide: respondes a la presencia en la góndola, a la altura de los ojos, a un letrero que invita y a un exhibidor que sorprende. Para ti una marca debe ganarse la atención en el espacio físico. MonteRojo te llega cuando se deja ver, y se queda en tu carrito cuando se hace notar."
      },
      B: {
        name: "El Auditor del Pasillo",
        text: "Recorres el pasillo completo antes de decidir y no te dejas llevar por el ruido visual: ignoras letreros, comparas todas las alturas y cuestionas el stock. Tu decisión es deliberada y comparativa. MonteRojo tiene que ganarte en el producto, porque la puesta en escena a ti no te mueve."
      },
      balanced: {
        name: "El Observador Selectivo",
        text: "Eres sensible al espacio, pero solo cuando suma. Hay señales que te atrapan, como un buen lugar en el estante o un exhibidor bien pensado, y otras que filtras sin esfuerzo. MonteRojo funciona contigo si su presencia es útil y no insistente: visible sin gritar."
      }
    }
  },

  brand: {
    name: "Construcción de marca",
    subcategories: [
      { name: "Percepción previa", code: "CM01", questions: [
        { text: "Cuando escuchas el nombre MonteRojo o ves el paquete por fuera, ¿qué es lo primero que se te viene a la cabeza?",
          a: "Me suena a una marca de snacks gourmet y finos que ya he escuchado antes, pensada para gente que busca algo elegante y de buen nivel.",
          b: "Me suena a una marca natural y saludable, pero que puede ser medio costosa y posiblemente la evite." },
        { text: "Antes de destapar el paquete y probarlos, ¿qué expectativas te genera la marca sobre lo que te vas a encontrar?",
          a: "Espero encontrarme con un sabor sofisticado, diferente a las papas tradicionales y de excelente calidad.",
          b: "Espero sentir algo más casero y real, como si estuviera comiendo un snack artesanal hecho sin tanto químico." }
      ]},
      { name: "Características distintivas", code: "CM02", questions: [
        { text: "De todo lo que ves en MonteRojo, ¿qué sientes que la hace una marca verdaderamente única frente a las demás?",
          a: "Sus combinaciones de sabores especiales e innovadores que no se encuentran en las marcas de siempre.",
          b: "El diseño de sus empaques y esa sensación de ser un producto local bien hecho con orgullo colombiano." },
        { text: "Si MonteRojo fuera una persona de tu grupo de amigos, ¿cómo te la imaginas?",
          a: "Alguien moderno y aesthetic, a quien le gustan las cosas de calidad y darse gustos especiales, es un pinchado.",
          b: "Alguien consciente y equilibrado, que le encanta probar y hacer cosas nuevas y ser especial con sus amigos." }
      ]},
      { name: "Alternativas y realidad", code: "CM03", questions: [
        { text: "Cuando comparas la idea que tenías de MonteRojo con la experiencia real al probar sus snacks, ¿qué percepción te queda?",
          a: "Siento que cumple totalmente lo que promete; el sabor y la calidad hacen que valga la pena cada peso.",
          b: "Siento que es un producto muy rico, pero a veces la fuerza y costumbre de las marcas tradicionales me hace dudar al elegirlo." },
        { text: "Cuando vas a comprar algo para picar y piensas en MonteRojo frente a las opciones de toda la vida, ¿dónde la ubicas en tu mente?",
          a: "Como mi opción principal para momentos especiales, reuniones con amigos o cuando quiero ofrecer algo distinto y de mejor calidad.",
          b: "Como una alternativa diferente a la que acudo de vez en cuando para variar y salirme de la rutina de los snacks comunes." }
      ]}
    ],
    profiles: {
      A: {
        name: "El Devoto del Gourmet",
        text: "Ves a MonteRojo como una marca fina, sofisticada y de buen nivel: sabores innovadores, calidad que justifica el precio y un lugar de honor para las ocasiones especiales. En tu mente es un pequeño lujo que vale la pena ofrecer. La marca ya tiene en ti un pedestal premium."
      },
      B: {
        name: "El Aliado de lo Artesanal",
        text: "Para ti MonteRojo es natural, casera y hecha con orgullo local: un snack real, sin tanto químico, al que recurres para variar la rutina. Valoras su diseño y su autenticidad, aunque la costumbre de las marcas tradicionales a veces pese. En tu cabeza es una alternativa cercana, no un lujo."
      },
      balanced: {
        name: "El Paladar de Dos Mundos",
        text: "Tu percepción de MonteRojo vive en el punto medio: la reconoces tanto por su lado gourmet como por su lado natural y artesanal. Puede ser tu antojo especial o tu alternativa de siempre, según el día. Para ti la marca es versátil y su identidad todavía se está definiendo."
      }
    }
  }
};

const AGE_RANGES = ["Menos de 18", "18 - 24", "25 - 34", "35 - 44", "45 - 54", "55 o más"];

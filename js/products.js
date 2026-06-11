/* Catálogo @bebe.pepon — imágenes locales desde Instagram */

const IMG = 'assets/images/products/';
const IMG_THUMB = IMG + 'thumbs/';



const CATALOG = {

  novedades: [

    {

      id: 1,

      name: 'Pelele con Lazo',

      price: 15,

      sizes: 'Tallas 6, 9, 12, 18, 24, 36, 48 meses · Lazo incluido',

      image: IMG_THUMB + '01-pelele-lazo.jpg',

      badge: 'Nuevo',

      tag: 'Confección propia',

      categories: ['peleles', 'bebe', 'novedades'],

      instagram: true

    },

    {

      id: 2,

      name: 'Ranita Volantes',

      price: 12,

      sizes: 'Tallas 6, 12, 18, 24, 36 meses',

      image: IMG_THUMB + '02-ranita-volantes.jpg',

      badge: 'Nuevo',

      tag: 'Confección propia',

      categories: ['ranitas', 'bebe', 'novedades'],

      instagram: true

    },

    {

      id: 3,

      name: 'Saquito Elásticos',

      price: 13,

      sizes: 'Tallas 6, 12, 18, 24, 36 meses',

      image: IMG_THUMB + '03-saquito-elasticos.jpg',

      badge: 'Nuevo',

      tag: 'Confección propia',

      categories: ['saquitos', 'bebe', 'novedades'],

      instagram: true

    },

    {

      id: 4,

      name: 'Jesusito 3 piezas',

      price: 19.90,

      sizes: 'Tallas 12, 18, 24, 36, 48 meses · Lazo incluido',

      image: IMG_THUMB + '04-jesusito-bebe.jpg',

      badge: 'Nuevo',

      tag: 'Confección propia',

      categories: ['jesusitos', 'bebe', 'novedades'],

      instagram: true

    }

  ],

  bestsellers: [

    {

      id: 5,

      name: 'Jesusito 3 piezas · Niños',

      price: 24.90,

      sizes: 'Tallas 2, 3, 4, 5, 6, 8 años · Lazo incluido',

      image: IMG_THUMB + '05-jesusito-ninos.jpg',

      badge: '🔥 Top ventas',

      sold: '+120 vendidos',

      categories: ['jesusitos', 'ninos'],

      instagram: true

    },

    {

      id: 6,

      name: 'Jesusito 3 piezas · Bebé',

      price: 19.90,

      sizes: 'Tallas 12, 18, 24, 36, 48 meses',

      image: IMG_THUMB + '06-jesusito-bebe-2.jpg',

      badge: '🔥 Top ventas',

      sold: '+98 vendidos',

      categories: ['jesusitos', 'bebe'],

      instagram: true

    },

    {

      id: 7,

      name: 'Blusa Cuello Volante',

      price: 15,

      sizes: 'Estampado liberty · Cuellos volantes',

      image: IMG_THUMB + '07-blusa-volante-floral.jpg',

      badge: '🔥 Top ventas',

      sold: '+95 vendidos',

      categories: ['volantes', 'ninos'],

      instagram: true

    },

    {

      id: 8,

      name: 'Ranita Vichy Azul',

      price: 12,

      sizes: 'Tallas 6, 12, 18, 24, 36 meses',

      image: IMG_THUMB + '08-ranita-vichy-azul.jpg',

      badge: '🔥 Top ventas',

      sold: '+88 vendidos',

      categories: ['ranitas', 'bebe'],

      instagram: true

    }

  ],

  catalogo: [

    {

      id: 9,

      name: 'Pelele con Lazo Rosa',

      price: 15,

      sizes: 'Tallas 6–48 meses · Lazo incluido',

      image: IMG_THUMB + '09-pelele-lazo-rosa.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['peleles', 'bebe'],

      instagram: true

    },

    {

      id: 10,

      name: 'Blusa Volante Rayas',

      price: 15,

      sizes: 'Cuello volante · Rayas rosa y amarillo',

      image: IMG_THUMB + '10-blusa-volante-rayas.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['volantes', 'ninos'],

      instagram: true

    },

    {

      id: 11,

      name: 'Jesusito 3 piezas · Niños',

      price: 24.90,

      sizes: 'Tallas 2–8 años',

      image: IMG_THUMB + '11-jesusito-ninos-2.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['jesusitos', 'ninos'],

      instagram: true

    },

    {

      id: 12,

      name: 'Ranita Vichy Beige',

      price: 12,

      sizes: 'Tallas 6–36 meses',

      image: IMG_THUMB + '12-ranita-vichy-beige.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['ranitas', 'bebe'],

      instagram: true

    },

    {

      id: 13,

      name: 'Jesusito 3 piezas · Bebé',

      price: 19.90,

      sizes: 'Tallas 12–48 meses',

      image: IMG_THUMB + '13-jesusito-bebe-3.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['jesusitos', 'bebe'],

      instagram: true

    },

    {

      id: 14,

      name: 'Conjunto Volantes',

      price: 18,

      sizes: 'Cuellos volantes · Tejido suave',

      image: IMG_THUMB + '14-conjunto-volantes.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['volantes', 'bebe'],

      instagram: true

    },

    {

      id: 15,

      name: 'Jesusito 3 piezas · Niños',

      price: 24.90,

      sizes: 'Tallas 2–8 años',

      image: IMG_THUMB + '15-jesusito-ninos-3.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['jesusitos', 'ninos'],

      instagram: true

    },

    {

      id: 16,

      name: 'Pelele Vichy',

      price: 15,

      sizes: 'Tallas 6–48 meses',

      image: IMG_THUMB + '16-pelele-vichy.jpg',

      badge: null,

      tag: 'Confección propia',

      categories: ['peleles', 'bebe'],

      instagram: true

    }

  ]

};



function getAllProducts() {

  const seen = new Set();

  return [...CATALOG.novedades, ...CATALOG.bestsellers, ...CATALOG.catalogo].filter(p => {

    if (seen.has(p.id)) return false;

    seen.add(p.id);

    return true;

  });

}



function getProductsByCategory(category) {

  return getAllProducts().filter(p => p.categories?.includes(category));

}



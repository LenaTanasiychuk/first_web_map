import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6/dist/maplibre-gl.mjs'

console.log('код рабочий')

const map = new maplibregl.Map({
    container: "map",
    style:{
        version: 8,
        sources: {},
        layers: []
    },
    center: [40,0],
    zoom:4,
    hash: true
})

map.on('load', () => {
    console.log('loaded');

    map.addLayer({
        id:"my_background",
        type: "background",
        paint: {
            "background-color": "#4deeea"
        }
    })

    map.addSource('countries', {
        type: 'geojson',
        data: './data/countries.geojson'
    })

    map.addLayer({
        id: 'countries-layer',
        type: 'fill',
        source: 'countries',
        paint: {
            'fill-color': ['match', ['get', 'MAPCOLOR7'], 1, '#FF5F1F',
            "#39ff14"]
        }

    })

    map.addSource('rivers', {
        type: 'geojson',
        data: './data/rivers.geojson'
    })

    map.addLayer({
        id: 'rivers-layer',
        type: 'line',
        source: 'rivers',
        paint: {
            'line-color': "#ff00ff"
        }

    })

    map.addSource('lakes', {
        type: 'geojson',
        data: './data/lakes.geojson'
    })


    map.addLayer({
        id: 'lakes-layer',
        type: 'fill',
        source: 'lakes',
        paint: {
            'fill-color': "#bc13fe"
        }

    })

    map.addLayer({
        id: 'lakes-layer2',
        type: 'line',
        source: 'lakes',
        paint: {
            'line-color': "white",
            'line-width' : 2
        }

    })


    map.addSource('cities', {
        type: 'geojson',
        data: './data/cities.geojson'
    })

    map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': ['match', ['get', 'NAME_RU'], "Москва", 'red',
            "black"],
            'circle-radius': 5.5
        },
        filter: ['>', ['get', 'POP_MAX'], 10000000]

    })

    const image = map.loadImage('./data/free.png').then((image) => {
        map.addImage("spb_pin", image.data)

        map.addLayer({
            id: 'spb-city',
            type: 'symbol',
            source: 'cities',
            layout: {
                'icon-image': 'spb_pin',
                'icon-size': 0.08
            },
            filter: ['==', ['get', 'NAME_RU'], "Санкт-Петербург"]
        })
    })

        map.addLayer({
        id: 'cities-layer2',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': 'yellow',
            'circle-radius': 2.5
        },
        filter:['all', 
            (['>', ['get', 'POP_MAX'], 1000000],['<', ['get', 'POP_MAX'], 10000000]),
            ['!=', ['get', 'NAME_RU'], "Санкт-Петербург"]]
        })

   
// POPUP    
map.on('click', ['cities-layer'], (e) => {

    // Создаём popup
    new maplibregl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`
            <b>Город:</b> ${e.features[0].properties.NAME_RU}
        `)
        .addTo(map);
});

//map.on('mouseenter', 'cities-layer', () => map.getCanvas().style.cursor = 'pointer');
//map.on('mouseleave', 'cities-layer', () => map.getCanvas().style.cursor = '');

    map.on('mouseenter', 'cities-layer', () => {
        map.getCanvas().style.cursor = "pointer"
    }),

    map.on('mouseenter', 'countries-layer', () => {
        map.getCanvas().style.cursor = "crosshair"
    }), 
    
    map.on('mouseleave', ['cities-layer','countries-layer'], () => {
        map.getCanvas().style.cursor = ''
    }) 

})


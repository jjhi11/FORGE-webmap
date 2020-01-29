
    
    require([
      // ArcGIS
      "esri/Map",
      "esri/views/MapView",
      "esri/views/SceneView",
      "esri/layers/FeatureLayer",
      "esri/layers/ImageryLayer",
      "esri/layers/MapImageLayer",
      "esri/layers/GroupLayer",
      "esri/core/watchUtils",
      "esri/layers/support/DimensionalDefinition",
      "esri/layers/support/MosaicRule",
      // Widgets
      "esri/widgets/Home",
      "esri/widgets/Zoom",
      "esri/widgets/Compass",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/BasemapToggle",
      "esri/widgets/ScaleBar",
      "esri/widgets/Attribution",
      "esri/widgets/LayerList",
      "esri/widgets/Locate",
      "esri/widgets/NavigationToggle",
      "esri/layers/GraphicsLayer",
      "esri/symbols/SimpleFillSymbol",
      "esri/Graphic",
      "esri/tasks/support/FeatureSet",
      "esri/tasks/support/Query",
      "esri/tasks/QueryTask",
      //DGrid
      "dstore/Memory",
      "dojo/data/ObjectStore",
      "dojo/data/ItemFileReadStore",
      "dojox/grid/DataGrid",
      "dgrid/OnDemandGrid",
      "dgrid/Selection",
      "dgrid/List",
      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",
      // Calcite Maps
      "calcite-maps/calcitemaps-v0.10",
      
      // Calcite Maps ArcGIS Support
      "calcite-maps/calcitemaps-arcgis-support-v0.10",
      "dojo/query",
      "dojo/domReady!"
    ], function(Map, MapView, SceneView, FeatureLayer, ImageryLayer, MapImageLayer, GroupLayer, watchUtils, DimensionalDefinition, MosaicRule, Home, Zoom, Compass, Search, Legend, SketchViewModel, BasemapToggle, ScaleBar, Attribution, LayerList, Locate, NavigationToggle, GraphicsLayer, SimpleFillSymbol, Graphic, FeatureSet, Query, QueryTask, Memory, ObjectStore, ItemFileReadStore, DataGrid, OnDemandGrid, Selection, List, Collapse, Dropdown, CalciteMaps, CalciteMapArcGISSupport, query) {
      /******************************************************************
       *
       * Create the map, view and widgets
       * 
       ******************************************************************/
      // Map
      var map = new Map({
                basemap: "hybrid",
                ground: "world-elevation",
            });
      
      // View
      var mapView = new SceneView({
                container: "mapViewDiv",
                map: map,
                center: [-112.884, 38.502],
                zoom: 13,
                padding: {
                    top: 50,
                    bottom: 0
                },
                // highlightOptions: {
                //     color: [255, 255, 0, 1],
                //     haloColor: "white",
                //     haloOpacity: 0.9,
                //     fillOpacity: 0.2
                //   },
                ui: {
                    components: []
                }
            });
      // Popup and panel sync
      mapView.when(function(){
        CalciteMapArcGISSupport.setPopupPanelSync(mapView);
      });
      // Search - add to navbar
      var searchWidget = new Search({
        container: "searchWidgetDiv",
        view: mapView
      });
      CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);
      // Map widgets
      var home = new Home({
        view: mapView
      });
      mapView.ui.add(home, "top-left");
      var zoom = new Zoom({
        view: mapView
      });
      mapView.ui.add(zoom, "top-left");
      var compass = new Compass({
        view: mapView
      });
      mapView.ui.add(compass, "top-left");
      
      var basemapToggle = new BasemapToggle({
        view: mapView,
        secondBasemap: "satellite"
      });

      // geolocate user position
      var locateWidget = new Locate({
        view: mapView,   // Attaches the Locate button to the view
      });

mapView.ui.add(locateWidget, "top-left");







 //popup templates for all layers







            landownership = new FeatureLayer ({
                url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_Webmap2020_View/FeatureServer/0",
                title: "Land Ownership",
                elevationInfo: [{
                    mode: "on-the-ground"
                }],


            });

            boundary = new FeatureLayer ({
                url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_Webmap2020_View/FeatureServer/3",
                title: "FORGE Boundary",
                elevationInfo: [{
                    mode: "on-the-ground"
                }],
            })

            wells = new FeatureLayer ({
                url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_Webmap2020_View/FeatureServer/4",
                title: "Wells",
                elevationInfo: [{
                    mode: "on-the-ground"
                }], 
            })

     
            
            mapView.map.add(wells);
            mapView.map.add(boundary);
            mapView.map.add(landownership);



            layerList = new LayerList({
                view: mapView,
                container: "legendDiv",
                listItemCreatedFunction: function(event) {
                    const item = event.item;
                    //console.log(item);
                    if (item.layer.type != "group") { // don't show legend twice
                        item.panel = {
                            content: "legend",
                            open: true
                        }
                        item.actionsSections = [
                            [{
                                title: "Layer information",
                                className: "esri-icon-description",
                                id: "information"
                            }],
                            [{
                                title: "Increase opacity",
                                className: "esri-icon-up",
                                id: "increase-opacity"
                            }, {
                                title: "Decrease opacity",
                                className: "esri-icon-down",
                                id: "decrease-opacity"
                            }]
                        ];
                    }
                }
            });
            
            //layerlist action for opacity
            
            layerList.on("trigger-action", function(event) {
            
                console.log(event);
                
                
                
                // Capture the action id.
                var id = event.action.id;
                
                var title = event.item.title;
                
                if (title === "FORGE Boundary") {
                                    layer = boundary;
                                } else if (title === "Landownership") {
                                    layer = landownership;
                                } else if (title === "Wells") {
                                    layer = wells;
                                } 
                if (id === "information") {
                
                  // if the information action is triggered, then
                  // open the item details page of the service layer
                  //window.open(title.url);
                
                layerInformation(title);
                
                
                
                } else                 if (id === "increase-opacity") {
                                    // if the increase-opacity action is triggered, then
                                    // increase the opacity of the GroupLayer by 0.25
                
                                    if (layer.opacity < 1) {
                                        layer.opacity += 0.1;
                                    }
                                } else if (id === "decrease-opacity") {
                                    // if the decrease-opacity action is triggered, then
                                    // decrease the opacity of the GroupLayer by 0.25
                
                                    if (layer.opacity > 0) {
                                        layer.opacity -= 0.1;
                                    }
                                }
                });
            
            
                        // Basemap events
                        query("#selectBasemapPanel").on("change", function(e) {
                            if (e.target.value == "ustopo") {
                                // setup the ustopo basemap global variable.
                                var ustopo = new Basemap({
                                    baseLayers: new TileLayer({
                                        url: "https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"
                                    }),
                                    title: "usTopographic",
                                    id: "ustopo"
                                });
                                mapView.map.basemap = ustopo;
                                // if mapview use basemaps defined in the value-vector=, but if mapview use value=
                            } else if (map.mview == "map") {
                                mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
                            } else { // =="scene"
                                mapView.map.basemap = e.target.value;
                            }
                        });

   






    });

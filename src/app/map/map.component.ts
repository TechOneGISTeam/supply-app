import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { loadModules } from "esri-loader";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit, OnDestroy {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  view: any;

  constructor() {}

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, FeatureLayer, Editor] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        // "esri/widgets/Popup",
        "esri/widgets/Editor"
      ]);

      // Configure the Map
      const mapProperties = {
        basemap: "streets"
        //Editor: editor
        //popup: Popup
      };

      const map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-112.358214, 33.449806],
        zoom: 11,
        map: map
      };

      this.view = new MapView(mapViewProperties);

      const editor = new Editor({
        view: this.view,
        layerInfos: [
          {
            layer: supplyLayer, // pass in the feature layer
            fieldConfig: [
              // Specify which fields to configure
              {
                name: "items",
                label: "Items"
              },
              {
                name: "Date",
                label: "Date"
              },
              {
                name: "Time",
                label: "Time"
              },
              {
                name: "Quantities",
                label: "Quantities"
              }
            ],
            enabled: true, // default is true, set to false to disable editing functionality
            addEnabled: true, // default is true, set to false to disable the ability to add a new feature
            updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
            deleteEnabled: true // default is true, set to false to disable the ability to delete features
          }
        ]
      });

      var supplyLayer = new FeatureLayer({
        url:
          //"https://bromin9284.maps.arcgis.com/apps/webappviewer/index.html?id=72f9177516434342acfca1c215ad6991",
          "https://services5.arcgis.com/v1vrXob3aBkrXcJy/arcgis/rest/services/supply_points/FeatureServer",
        // popup: {
        //   title: "{Property}",
        //   content: []
        // },
        // layerInfos: [
        //   {
        //     layer: supplyLayer, // pass in the feature layer
        //     fieldConfig: [
        //       // Specify which fields to configure
        //       {
        //         name: "items",
        //         label: "Items"
        //       },
        //       {
        //         name: "Date",
        //         label: "Date"
        //       },
        //       {
        //         name: "Time",
        //         label: "Time"
        //       },
        //       {
        //         name: "Quantities",
        //         label: "Quantities"
        //       }
        //     ],
        //     enabled: true, // default is true, set to false to disable editing functionality
        //     addEnabled: true, // default is true, set to false to disable the ability to add a new feature
        //     updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
        //     deleteEnabled: true // default is true, set to false to disable the ability to delete features
        //   }
        //],
        popupTemplate: {
          title: "{Property}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "OBJECTID"
                },
                {
                  fieldName: "store"
                },
                {
                  fieldName: "street"
                },
                {
                  fieldName: "city"
                },
                {
                  fieldName: "state"
                },
                {
                  fieldName: "items"
                },
                {
                  fieldName: "Zip"
                },
                {
                  fieldName: "Date"
                },
                {
                  fieldName: "Time"
                },
                {
                  fieldName: "Quantities"
                }
              ]
            }
          ]
        }
      });

      map.add(supplyLayer);

      // // Add widget to top-right of the view
      map.add(editor, { position: "top-right" });

      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}

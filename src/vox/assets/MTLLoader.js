/**
 * Loads a Wavefront .mtl file specifying materials
 *
 * @author angelxuanchang
 */

function MTLLoader() {
  this.setMaterialOptions = function(value) {
    this.materialOptions = value;
    return this;
  };

  this.parse = function(text, path) {
    var lines = text.split("\n");
    var info = {};
    var delimiter_pattern = /\s+/;
    var materialsInfo = {};

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      line = line.trim();

      if (line.length === 0 || line.charAt(0) === "#") {
        // Blank line or comment ignore
        continue;
      }

      var pos = line.indexOf(" ");
      var key = pos >= 0 ? line.substring(0, pos) : line;
      key = key.toLowerCase();

      var value = pos >= 0 ? line.substring(pos + 1) : "";
      value = value.trim();

      if (key === "newmtl") {
        // New material
        info = { name: value };
        materialsInfo[value] = info;
      } else {
        if (key === "ka" || key === "kd" || key === "ks" || key === "ke") {
          var ss = value.split(delimiter_pattern, 3);
          info[key] = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
        } else {
          info[key] = value;
        }
      }
    }

    var materialCreator = new MaterialCreator(this.resourcePath || path, this.materialOptions);

    materialCreator.setMaterials(materialsInfo);
    materialCreator.preload();
    return materialCreator;
  };
}

function MaterialCreator(baseUrl, options) {
  this.baseUrl = baseUrl || "";
  this.options = options;
  this.materialsInfo = {};
  this.materials = {};
  this.materialsArray = [];
  this.nameLookup = {};
}

MaterialCreator.prototype = {
  constructor: MaterialCreator,

  setMaterials: function(materialsInfo) {
    this.materialsInfo = this.convert(materialsInfo);
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};
  },

  convert: function(materialsInfo) {
    if (!this.options) return materialsInfo;

    var converted = {};

    for (var mn in materialsInfo) {
      // Convert materials info into normalized form based on options

      var mat = materialsInfo[mn];
      var covmat = {};
      converted[mn] = covmat;

      for (var prop in mat) {
        var save = true;
        var value = mat[prop];
        var lprop = prop.toLowerCase();

        switch (lprop) {
          case "kd":
          case "ka":
          case "ks":
            // Diffuse color (color under white light) using RGB values

            if (this.options && this.options.normalizeRGB) {
              value = [value[0] / 255, value[1] / 255, value[2] / 255];
            }

            if (this.options && this.options.ignoreZeroRGBs) {
              if (value[0] === 0 && value[1] === 0 && value[2] === 0) {
                // ignore

                save = false;
              }
            }

            break;

          default:
            break;
        }

        if (save) {
          covmat[lprop] = value;
        }
      }
    }

    return converted;
  },

  preload: function() {
    for (var mn in this.materialsInfo) {
      this.create(mn);
    }
  },

  getIndex: function(materialName) {
    return this.nameLookup[materialName];
  },

  getAsArray: function() {
    var index = 0;

    for (var mn in this.materialsInfo) {
      this.materialsArray[index] = this.create(mn);
      this.nameLookup[mn] = index;
      index++;
    }

    return this.materialsArray;
  },

  create: function(materialName) {
    if (this.materials[materialName] === undefined) {
      this.materials[materialName] = this.createMaterial_(materialName);
    }

    return this.materials[materialName];
  },

  createMaterial_: function(materialName) {
    // Create material

    var scope = this;
    var mat = this.materialsInfo[materialName];
    var params = {
      name: materialName
    };

    for (var prop in mat) {
      var value = mat[prop];
      var n;

      if (value === "") continue;

      switch (prop.toLowerCase()) {
        // Ns is material specular exponent

        case "kd":
          // Diffuse color (color under white light) using RGB values
          params.color = value;
          break;

        case "ks":
          // Specular color (color when light is reflected from shiny surface) using RGB values
          params.specular = value;
          break;

        case "ke":
          // Emissive using RGB values
          params.emissive = value;
          break;

        case "map_kd":
          // Diffuse texture map
          setMapForType("map", value);
          break;

        case "map_ks":
          // Specular map
          setMapForType("specularMap", value);
          break;

        case "map_ke":
          // Emissive map
          setMapForType("emissiveMap", value);
          break;

        case "map_ka":
          // ao/light
          setMapForType("lightMap", value);
          break;

        case "map_pr":
          //roughessMap/glossiness
          setMapForType("roughnessMap", value);
          break;
        case "map_pm":
          //metalnessMap
          setMapForType("metalnessMap", value);
          break;

        case "norm":
          setMapForType("normalMap", value);
          break;

        case "map_bump":
        case "bump":
          // Bump texture map
          setMapForType("bumpMap", value);

          break;

        case "map_d":
          // Alpha map

          setMapForType("alphaMap", value);
          params.transparent = true;

          break;

        case "ns":
          // The specular exponent (defines the focus of the specular highlight)
          // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.
          params.shininess = parseFloat(value);

          break;

        case "d":
        case "tf": //Maya 滤光透射
          n = parseFloat(value);

          if (n < 1) {
            params.opacity = n;
            params.transparent = true;
          }

          break;

        case "tr":
          n = parseFloat(value);

          if (this.options && this.options.invertTrProperty) n = 1 - n;

          if (n > 0) {
            params.opacity = 1 - n;
            params.transparent = true;
          }

          break;

        default:
          break;
      }
    }

    return params;

    function setMapForType(mapType, value) {
      if (params[mapType]) return; // Keep the first encountered texture

      var texParams = scope.getTextureParams(value, params);

      params[mapType] = texParams;
    }
  },

  getTextureParams: function(value, matParams) {
    var texParams = {
      scale: [1, 1],
      offset: [0, 0]
    };

    var items = value.split(/\s+/);
    var pos;

    pos = items.indexOf("-bm");

    if (pos >= 0) {
      matParams.bumpScale = parseFloat(items[pos + 1]);
      items.splice(pos, 2);
    }

    pos = items.indexOf("-s");

    if (pos >= 0) {
      texParams.scale = [parseFloat(items[pos + 1]), parseFloat(items[pos + 2])];
      items.splice(pos, 4); // we expect 3 parameters here!
    }

    pos = items.indexOf("-o");

    if (pos >= 0) {
      texParams.offset = [parseFloat(items[pos + 1]), parseFloat(items[pos + 2])];
      items.splice(pos, 4); // we expect 3 parameters here!
    }

    texParams.url = items.join(" ").trim();
    return texParams;
  }
};

// module.exports = MTLLoader;
export { MTLLoader };

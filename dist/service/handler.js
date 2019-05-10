module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@elastic/elasticsearch");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "@elastic/elasticsearch"
var elasticsearch_ = __webpack_require__(0);

// CONCATENATED MODULE: ./elasticSearch/elasticSearchConnect.ts

const esClient = new elasticsearch_["Client"]({
  node: `https://${process.env.ELASTICSEARCH_URL}`
});
// CONCATENATED MODULE: ./elasticSearch/mappings.ts
function getESMappings(index) {
  return {
    index,
    body: {
      properties: {
        id: {
          type: "text"
        },
        description: {
          type: "text"
        },
        name: {
          type: "text"
        },
        addedAt: {
          type: "number"
        }
      }
    }
  };
}
// CONCATENATED MODULE: ./streams/utils/index.ts
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function transformData(newImage) {
  const transformedObject = {};
  Object.keys(newImage).forEach(key => {
    const dataType = Object.keys(newImage[key])[0];
    transformedObject[key] = newImage[key][dataType];
  });
  return transformedObject;
}

function extractRecordsFromDynamodbEvent(event) {
  if (!event.Records || !Array.isArray(event.Records) || event.Records.length <= 0) {
    return null;
  }

  return event.Records.reduce((acculator, current) => {
    const ACTION = current.eventName;
    const existingRecords = acculator[ACTION] || [];
    const existsDynamoDb = current.dynamodb && current.dynamodb.NewImage;

    if (existsDynamoDb) {
      return _objectSpread({}, acculator, {
        [ACTION]: [...existingRecords, transformData(current.dynamodb.NewImage)]
      });
    }
  }, {});
}
const actions = {
  INSERT: "INSERT",
  UPDATE: "UPDATE"
};
// CONCATENATED MODULE: ./elasticSearch/config.ts
const config = {
  INDEX: "defaultevents",
  TYPE: "bookingevent"
};
// CONCATENATED MODULE: ./streams/process.ts




async function indexElasticSearch(event) {
  try {
    // check if indices already exist
    const exists = await esClient.indices.exists({
      index: config.INDEX
    });

    if (!exists) {
      // if not create new index and mappings for it
      await esClient.indices.create(getESMappings(config.INDEX));
    } // extract data


    const dataArray = extractRecordsFromDynamodbEvent(event)[actions.INSERT] || []; // default to empty

    await Promise.all(dataArray.map(async data => {
      await esClient.index({
        id: data.id,
        index: config.INDEX,
        body: data
      });
    }));
  } catch (err) {
    throw err;
  }
}
// CONCATENATED MODULE: ./handler.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processStreams", function() { return processStreams; });

async function processStreams(event) {
  await indexElasticSearch(event);
}

/***/ })
/******/ ]);
//# sourceMappingURL=handler.js.map
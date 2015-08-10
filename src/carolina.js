/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousCarolina = root.Carolina || {};

  var callbacks = [], lastFrame, nullObject = new THREE.Object3D();
  var vector = new THREE.Vector3();
  var ZERO = new THREE.Vector3();
  var radialBreadth = Math.PI / 4;

  var pacing = [
    { startTime: 0, palette: 0 },
    { startTime: 40.41720300000004 * 1000, palette: 1 },
    { startTime: 72.06894500000004 * 1000, palette: 2 },
    { startTime: 95.51321599999989 * 1000, palette: 4 },
    { startTime: 142.6998529999998 * 1000, palette: 3 },
    { startTime: 166.29350599999967 * 1000, palette: 4 },
    { startTime: 229.26353299999968 * 1000, palette: 0 }
  ];
  pacing.index = 0;

  var feelingIt = [
    { startTime: 100.37431099999995 * 1000 },
    { startTime: 102.31557599999991 * 1000 },
    { startTime: 108.26768899999989 * 1000 },
    { startTime: 116.13101599999978 * 1000 },
    { startTime: 118.05033499999975 * 1000 },
    { startTime: 171.1942029999997 * 1000 },
    { startTime: 173.12963699999986 * 1000 },
    { startTime: 179.08271100000007 * 1000 },
    { startTime: 186.92243099999982 * 1000 },
    { startTime: 188.89720899999975 * 1000 }
    // { startTime: 194.8994769999995 * 1000 }
  ];
  feelingIt.index = 0;

  var bendInfluence = [

    { startTime: (60 + 13) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 15) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 17) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 19) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 21) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 23) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 25) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (60 + 27) * 1000, rotation: 0 },

    { startTime: (120 + 23) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 25) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 27) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 29) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 31) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 33) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 35) * 1000, rotation: Math.random() * radialBreadth - radialBreadth / 2 },
    { startTime: (120 + 37) * 1000, rotation: 0 }

  ];
  bendInfluence.index = 0;

  var finalStrike = [
    { startTime: 242.250568000001 * 1000 }
  ];
  finalStrike.index = 0;

  var colors = {
    lobby: [
      'rgb(255, 255, 255)',
      'rgb(222, 62, 81)',
      'rgb(92, 148, 66)',
      'rgb(237, 115, 54)',
      'rgb(238, 110, 73)',
      'rgb(121, 73, 140)',
      'rgb(40, 78, 120)',
      'rgb(99, 46, 30)',
      'rgb(58, 71, 100)',
      'rgb(239, 173, 180)'
    ],
    firstVerse: [
      'rgb(211, 211, 211)',
      'rgb(254, 235, 132)',
      'rgb(235, 112, 77)',
      'rgb(0, 185, 242)',
      'rgb(70, 184, 85)',
      'rgb(184, 73, 120)',  //
      'rgb(109, 100, 147)',
      'rgb(68, 88, 113)',
      'rgb(12, 12, 12)',
      'rgb(70, 106, 208)'
    ],
    secondVerse: [
      'rgb(197, 220, 223)',
      'rgb(132, 175, 191)',
      'rgb(96, 128, 182)',
      'rgb(253, 148, 144)',
      'rgb(254, 233, 126)',
      'rgb(225, 253, 223)',
      'rgb(172, 172, 172)',
      'rgb(147, 185, 151)',
      'rgb(20, 20, 20)',
      'rgb(247, 149, 82)'
    ],
    thirdVerse: [
      'rgb(151, 244, 255)',
      'rgb(251, 243, 176)',
      'rgb(41, 53, 188)',
      'rgb(165, 220, 141)',
      'rgb(133, 106, 166)',
      'rgb(237, 148, 179)',
      'rgb(88, 90, 225)',
      'rgb(55, 55, 55)',
      'rgb(246, 50, 50)',
      'rgb(250, 200, 120)'
    ],
    chorus: [
      'rgb(245, 233, 120)',
      'rgb(155, 136, 162)',
      'rgb(255, 9, 89)',    //
      'rgb(229, 23, 87)',
      'rgb(12, 109, 82)',
      'rgb(220, 14, 2)',
      'rgb(255, 255, 255)',
      'rgb(131, 161, 197)',
      'rgb(126, 61, 100)',
      'rgb(212, 110, 25)'
    ]
  };

  _.each(colors, function(list, name) {
    _.each(list, function(color, i) {
      colors[name][i] = new THREE.Color(color);
    });
  });

  var onload = _.after(2, function() {

    Carolina._ready = true;
    _.each(callbacks, function(c) {
      c();
    });
    callbacks.length = 0;

  });

  var propertyNames = [
    'prog',
    'kick',
    'perc',
    'timpani',
    'bass',
    'hook',
    'guitar',
    'mellotron',
    'vanguard'
  ];

  var Carolina = root.Carolina = {

    // triggers: (function() {

    //   var triggers = {};
    //   var types = propertyNames;
    //   var ready = _.after(types.length, onload);

    //   _.each(types, function(type) {

    //     xhr.getJSON('/data/' + type + '.json', function(data) {
    //       triggers[type] = data;
    //       data.index = 0;
    //       Carolina.register(type, Math.max(Math.floor(data.length / 10), 1));
    //       ready();
    //     });

    //   });

    //   return triggers;

    // })(),

    triggers: (function() {

      // onload();

      return {
          bass: [{"startTime":24664,"duration":167},{"startTime":25148,"duration":84},{"startTime":25385,"duration":133},{"startTime":25619,"duration":167},{"startTime":25869,"duration":151},{"startTime":26120,"duration":168},{"startTime":26371,"duration":134},{"startTime":27324,"duration":367},{"startTime":27741,"duration":135},{"startTime":28076,"duration":151},{"startTime":28577,"duration":134},{"startTime":29062,"duration":118},{"startTime":29296,"duration":167},{"startTime":29563,"duration":184},{"startTime":29764,"duration":17},{"startTime":29797,"duration":134},{"startTime":30047,"duration":134},{"startTime":30315,"duration":136},{"startTime":30502,"duration":16},{"startTime":31270,"duration":334},{"startTime":32022,"duration":101},{"startTime":32540,"duration":118},{"startTime":33008,"duration":134},{"startTime":33242,"duration":135},{"startTime":33459,"duration":235},{"startTime":33744,"duration":150},{"startTime":33978,"duration":200},{"startTime":34262,"duration":33},{"startTime":34329,"duration":67},{"startTime":34429,"duration":50},{"startTime":35231,"duration":304},{"startTime":35719,"duration":67},{"startTime":35969,"duration":134},{"startTime":36404,"duration":200},{"startTime":36922,"duration":183},{"startTime":37173,"duration":150},{"startTime":37440,"duration":168},{"startTime":37624,"duration":34},{"startTime":37674,"duration":134},{"startTime":37891,"duration":218},{"startTime":38175,"duration":168},{"startTime":39178,"duration":318},{"startTime":39629,"duration":117},{"startTime":39897,"duration":100},{"startTime":40365,"duration":102},{"startTime":40869,"duration":133},{"startTime":41102,"duration":151},{"startTime":41370,"duration":217},{"startTime":41604,"duration":167},{"startTime":41855,"duration":200},{"startTime":42122,"duration":150},{"startTime":43091,"duration":251},{"startTime":43576,"duration":33},{"startTime":43843,"duration":67},{"startTime":44328,"duration":101},{"startTime":44796,"duration":117},{"startTime":45048,"duration":99},{"startTime":45281,"duration":16},{"startTime":45315,"duration":135},{"startTime":45551,"duration":116},{"startTime":45768,"duration":200},{"startTime":46085,"duration":34},{"startTime":46153,"duration":32},{"startTime":47055,"duration":285},{"startTime":47522,"duration":51},{"startTime":47773,"duration":118},{"startTime":48258,"duration":134},{"startTime":48742,"duration":151},{"startTime":48994,"duration":166},{"startTime":49211,"duration":200},{"startTime":49494,"duration":151},{"startTime":49729,"duration":234},{"startTime":49996,"duration":134},{"startTime":50951,"duration":301},{"startTime":51453,"duration":20},{"startTime":51687,"duration":100},{"startTime":52121,"duration":17},{"startTime":52172,"duration":133},{"startTime":52656,"duration":134},{"startTime":52907,"duration":83},{"startTime":53108,"duration":434},{"startTime":53642,"duration":184},{"startTime":53960,"duration":150},{"startTime":56135,"duration":117},{"startTime":56637,"duration":150},{"startTime":56870,"duration":150},{"startTime":57087,"duration":202},{"startTime":57355,"duration":150},{"startTime":57589,"duration":200},{"startTime":57889,"duration":168},{"startTime":58825,"duration":301},{"startTime":59243,"duration":50},{"startTime":59327,"duration":83},{"startTime":59561,"duration":100},{"startTime":59679,"duration":82},{"startTime":59945,"duration":251},{"startTime":60532,"duration":201},{"startTime":60767,"duration":183},{"startTime":60968,"duration":267},{"startTime":61268,"duration":134},{"startTime":61502,"duration":217},{"startTime":61803,"duration":134},{"startTime":62004,"duration":16},{"startTime":62739,"duration":301},{"startTime":63224,"duration":66},{"startTime":63474,"duration":67},{"startTime":63960,"duration":99},{"startTime":64460,"duration":101},{"startTime":64694,"duration":151},{"startTime":64945,"duration":167},{"startTime":65146,"duration":16},{"startTime":65179,"duration":168},{"startTime":65413,"duration":203},{"startTime":65733,"duration":183},{"startTime":66702,"duration":317},{"startTime":67187,"duration":83},{"startTime":67437,"duration":134},{"startTime":67889,"duration":17},{"startTime":67939,"duration":167},{"startTime":68424,"duration":183},{"startTime":68674,"duration":151},{"startTime":68875,"duration":17},{"startTime":68909,"duration":183},{"startTime":69126,"duration":183},{"startTime":69393,"duration":184},{"startTime":69677,"duration":134},{"startTime":70632,"duration":351},{"startTime":71100,"duration":50},{"startTime":71351,"duration":167},{"startTime":71786,"duration":33},{"startTime":71836,"duration":133},{"startTime":72337,"duration":50},{"startTime":72587,"duration":51},{"startTime":72822,"duration":234},{"startTime":73072,"duration":134},{"startTime":73323,"duration":167},{"startTime":73607,"duration":134},{"startTime":73841,"duration":50},{"startTime":74509,"duration":368},{"startTime":75262,"duration":17},{"startTime":75312,"duration":83},{"startTime":75816,"duration":83},{"startTime":76317,"duration":117},{"startTime":76551,"duration":134},{"startTime":76818,"duration":201},{"startTime":77036,"duration":200},{"startTime":77303,"duration":168},{"startTime":77588,"duration":116},{"startTime":78573,"duration":301},{"startTime":78992,"duration":16},{"startTime":79225,"duration":101},{"startTime":79727,"duration":83},{"startTime":80462,"duration":153},{"startTime":80715,"duration":134},{"startTime":80949,"duration":117},{"startTime":81183,"duration":151},{"startTime":81502,"duration":49},{"startTime":81567,"duration":51},{"startTime":82453,"duration":301},{"startTime":82921,"duration":16},{"startTime":83172,"duration":50},{"startTime":83673,"duration":67},{"startTime":84392,"duration":83},{"startTime":84659,"duration":167},{"startTime":84893,"duration":184},{"startTime":85127,"duration":151},{"startTime":85429,"duration":118},{"startTime":87620,"duration":100},{"startTime":88339,"duration":167},{"startTime":88572,"duration":167},{"startTime":88773,"duration":16},{"startTime":88823,"duration":117},{"startTime":89074,"duration":117},{"startTime":89374,"duration":118},{"startTime":89509,"duration":50},{"startTime":90294,"duration":337},{"startTime":90681,"duration":167},{"startTime":91015,"duration":134},{"startTime":91517,"duration":133},{"startTime":92236,"duration":133},{"startTime":92486,"duration":200},{"startTime":92703,"duration":184},{"startTime":92971,"duration":150},{"startTime":93255,"duration":100},{"startTime":95427,"duration":34},{"startTime":95864,"duration":168},{"startTime":96132,"duration":183},{"startTime":96332,"duration":134},{"startTime":96567,"duration":551},{"startTime":97369,"duration":150},{"startTime":97702,"duration":737},{"startTime":98522,"duration":501},{"startTime":99190,"duration":34},{"startTime":99290,"duration":168},{"startTime":99809,"duration":49},{"startTime":100042,"duration":17},{"startTime":100293,"duration":50},{"startTime":100747,"duration":251},{"startTime":101064,"duration":17},{"startTime":101165,"duration":84},{"startTime":101299,"duration":84},{"startTime":101783,"duration":67},{"startTime":102034,"duration":17},{"startTime":102285,"duration":50},{"startTime":102752,"duration":85},{"startTime":103003,"duration":50},{"startTime":103254,"duration":151},{"startTime":103739,"duration":83},{"startTime":103972,"duration":251},{"startTime":104240,"duration":117},{"startTime":104491,"duration":469},{"startTime":105209,"duration":101},{"startTime":105579,"duration":318},{"startTime":105964,"duration":434},{"startTime":106415,"duration":535},{"startTime":107218,"duration":133},{"startTime":107702,"duration":17},{"startTime":107919,"duration":68},{"startTime":108170,"duration":100},{"startTime":108304,"duration":66},{"startTime":108421,"duration":33},{"startTime":108638,"duration":234},{"startTime":109156,"duration":83},{"startTime":109891,"duration":101},{"startTime":110159,"duration":50},{"startTime":110392,"duration":51},{"startTime":110663,"duration":67},{"startTime":110897,"duration":83},{"startTime":111130,"duration":135},{"startTime":111632,"duration":50},{"startTime":111850,"duration":216},{"startTime":112133,"duration":67},{"startTime":112301,"duration":16},{"startTime":112335,"duration":500},{"startTime":113069,"duration":17},{"startTime":113102,"duration":135},{"startTime":113387,"duration":402},{"startTime":113821,"duration":402},{"startTime":114272,"duration":519},{"startTime":114841,"duration":34},{"startTime":114891,"duration":34},{"startTime":114941,"duration":33},{"startTime":114992,"duration":16},{"startTime":115075,"duration":83},{"startTime":115779,"duration":84},{"startTime":116030,"duration":67},{"startTime":116230,"duration":34},{"startTime":116280,"duration":101},{"startTime":116481,"duration":267},{"startTime":116815,"duration":17},{"startTime":117067,"duration":82},{"startTime":117535,"duration":116},{"startTime":118270,"duration":16},{"startTime":118520,"duration":50},{"startTime":118754,"duration":17},{"startTime":119005,"duration":100},{"startTime":119473,"duration":100},{"startTime":119707,"duration":217},{"startTime":119991,"duration":101},{"startTime":120159,"duration":33},{"startTime":120208,"duration":487},{"startTime":120946,"duration":234},{"startTime":121297,"duration":368},{"startTime":121698,"duration":385},{"startTime":122149,"duration":251},{"startTime":122417,"duration":267},{"startTime":122735,"duration":33},{"startTime":122785,"duration":33},{"startTime":122851,"duration":18},{"startTime":122968,"duration":151},{"startTime":123473,"duration":97},{"startTime":123720,"duration":67},{"startTime":123971,"duration":68},{"startTime":124205,"duration":50},{"startTime":124405,"duration":252},{"startTime":124724,"duration":99},{"startTime":124874,"duration":16},{"startTime":124923,"duration":17},{"startTime":126898,"duration":51},{"startTime":127400,"duration":68},{"startTime":127617,"duration":151},{"startTime":127834,"duration":385},{"startTime":128369,"duration":151},{"startTime":129589,"duration":368},{"startTime":130074,"duration":16},{"startTime":130324,"duration":67},{"startTime":130811,"duration":84},{"startTime":131330,"duration":150},{"startTime":131563,"duration":168},{"startTime":131831,"duration":368},{"startTime":132266,"duration":216},{"startTime":132583,"duration":117},{"startTime":134806,"duration":133},{"startTime":135274,"duration":117},{"startTime":135508,"duration":167},{"startTime":135728,"duration":233},{"startTime":135978,"duration":201},{"startTime":136212,"duration":217},{"startTime":136530,"duration":134},{"startTime":137566,"duration":201},{"startTime":137950,"duration":34},{"startTime":138218,"duration":84},{"startTime":138702,"duration":134},{"startTime":139454,"duration":185},{"startTime":139706,"duration":166},{"startTime":139906,"duration":16},{"startTime":139939,"duration":167},{"startTime":140140,"duration":234},{"startTime":140441,"duration":134},{"startTime":140674,"duration":36},{"startTime":141513,"duration":201},{"startTime":141897,"duration":34},{"startTime":142165,"duration":67},{"startTime":142666,"duration":134},{"startTime":143117,"duration":101},{"startTime":143636,"duration":16},{"startTime":143669,"duration":116},{"startTime":143836,"duration":133},{"startTime":144120,"duration":118},{"startTime":144421,"duration":17},{"startTime":144621,"duration":34},{"startTime":145107,"duration":550},{"startTime":146095,"duration":66},{"startTime":146596,"duration":50},{"startTime":147314,"duration":71},{"startTime":147549,"duration":183},{"startTime":147799,"duration":68},{"startTime":148050,"duration":150},{"startTime":148301,"duration":134},{"startTime":149387,"duration":167},{"startTime":149755,"duration":16},{"startTime":150022,"duration":67},{"startTime":150490,"duration":17},{"startTime":150524,"duration":33},{"startTime":151261,"duration":51},{"startTime":151495,"duration":184},{"startTime":151729,"duration":17},{"startTime":151997,"duration":150},{"startTime":152248,"duration":50},{"startTime":152348,"duration":33},{"startTime":153368,"duration":233},{"startTime":153719,"duration":16},{"startTime":153986,"duration":66},{"startTime":154453,"duration":34},{"startTime":155189,"duration":17},{"startTime":155473,"duration":100},{"startTime":155623,"duration":101},{"startTime":155927,"duration":150},{"startTime":156177,"duration":51},{"startTime":156261,"duration":33},{"startTime":158367,"duration":33},{"startTime":159119,"duration":83},{"startTime":159353,"duration":150},{"startTime":159537,"duration":133},{"startTime":159837,"duration":118},{"startTime":160088,"duration":34},{"startTime":160943,"duration":385},{"startTime":161795,"duration":67},{"startTime":162280,"duration":33},{"startTime":162998,"duration":84},{"startTime":163266,"duration":33},{"startTime":163316,"duration":302},{"startTime":163751,"duration":150},{"startTime":164069,"duration":33},{"startTime":165472,"duration":33},{"startTime":165723,"duration":34},{"startTime":165976,"duration":67},{"startTime":166193,"duration":151},{"startTime":166712,"duration":100},{"startTime":166962,"duration":334},{"startTime":167396,"duration":518},{"startTime":168132,"duration":184},{"startTime":168650,"duration":585},{"startTime":169386,"duration":468},{"startTime":169937,"duration":184},{"startTime":170138,"duration":100},{"startTime":170639,"duration":84},{"startTime":170859,"duration":50},{"startTime":171377,"duration":117},{"startTime":171627,"duration":202},{"startTime":171912,"duration":100},{"startTime":172029,"duration":33},{"startTime":172112,"duration":100},{"startTime":173132,"duration":17},{"startTime":173599,"duration":50},{"startTime":173850,"duration":18},{"startTime":174101,"duration":100},{"startTime":174570,"duration":149},{"startTime":174836,"duration":368},{"startTime":175288,"duration":16},{"startTime":175321,"duration":150},{"startTime":175522,"duration":250},{"startTime":176075,"duration":117},{"startTime":176510,"duration":184},{"startTime":176777,"duration":335},{"startTime":177279,"duration":451},{"startTime":177813,"duration":201},{"startTime":178031,"duration":100},{"startTime":178516,"duration":83},{"startTime":178749,"duration":50},{"startTime":179234,"duration":85},{"startTime":179485,"duration":201},{"startTime":179769,"duration":50},{"startTime":179903,"duration":17},{"startTime":179937,"duration":16},{"startTime":179987,"duration":117},{"startTime":180488,"duration":67},{"startTime":181209,"duration":33},{"startTime":181476,"duration":50},{"startTime":181710,"duration":34},{"startTime":181978,"duration":100},{"startTime":182463,"duration":100},{"startTime":182696,"duration":235},{"startTime":182947,"duration":151},{"startTime":183131,"duration":200},{"startTime":183398,"duration":234},{"startTime":183933,"duration":117},{"startTime":184401,"duration":167},{"startTime":184635,"duration":217},{"startTime":184870,"duration":149},{"startTime":185069,"duration":34},{"startTime":185121,"duration":183},{"startTime":185320,"duration":251},{"startTime":185671,"duration":287},{"startTime":186376,"duration":100},{"startTime":186593,"duration":100},{"startTime":187078,"duration":33},{"startTime":187345,"duration":201},{"startTime":187713,"duration":50},{"startTime":187863,"duration":100},{"startTime":188832,"duration":101},{"startTime":189067,"duration":83},{"startTime":189334,"duration":66},{"startTime":189585,"duration":33},{"startTime":189836,"duration":82},{"startTime":190320,"duration":167},{"startTime":190554,"duration":234},{"startTime":190805,"duration":119},{"startTime":190991,"duration":518},{"startTime":191794,"duration":83},{"startTime":192261,"duration":184},{"startTime":192512,"duration":367},{"startTime":193030,"duration":150},{"startTime":193264,"duration":234},{"startTime":193548,"duration":134},{"startTime":193699,"duration":167},{"startTime":194301,"duration":49},{"startTime":194518,"duration":83},{"startTime":194986,"duration":83},{"startTime":195236,"duration":235},{"startTime":195587,"duration":33},{"startTime":195654,"duration":201},{"startTime":196241,"duration":67},{"startTime":196492,"duration":34},{"startTime":196743,"duration":83},{"startTime":196976,"duration":34},{"startTime":197211,"duration":100},{"startTime":197745,"duration":51},{"startTime":198213,"duration":352},{"startTime":198648,"duration":251},{"startTime":198916,"duration":166},{"startTime":199143,"duration":424},{"startTime":199584,"duration":16},{"startTime":200386,"duration":401},{"startTime":200871,"duration":69},{"startTime":201141,"duration":150},{"startTime":201642,"duration":133},{"startTime":202127,"duration":167},{"startTime":202377,"duration":184},{"startTime":202595,"duration":451},{"startTime":203079,"duration":568},{"startTime":204349,"duration":369},{"startTime":204734,"duration":34},{"startTime":204834,"duration":150},{"startTime":205034,"duration":218},{"startTime":205536,"duration":34},{"startTime":205586,"duration":184},{"startTime":205923,"duration":33},{"startTime":206073,"duration":151},{"startTime":206307,"duration":1003},{"startTime":207344,"duration":251},{"startTime":208280,"duration":400},{"startTime":208781,"duration":66},{"startTime":209048,"duration":117},{"startTime":209468,"duration":16},{"startTime":209516,"duration":184},{"startTime":210018,"duration":1540},{"startTime":212209,"duration":468},{"startTime":212711,"duration":67},{"startTime":212861,"duration":18},{"startTime":212911,"duration":17},{"startTime":212962,"duration":217},{"startTime":213396,"duration":17},{"startTime":213446,"duration":167},{"startTime":213764,"duration":1654},{"startTime":216140,"duration":334},{"startTime":216624,"duration":134},{"startTime":216825,"duration":234},{"startTime":217126,"duration":49},{"startTime":217377,"duration":133},{"startTime":217844,"duration":201},{"startTime":218095,"duration":1337},{"startTime":220050,"duration":452},{"startTime":220535,"duration":134},{"startTime":220752,"duration":17},{"startTime":220786,"duration":203},{"startTime":221189,"duration":284},{"startTime":221791,"duration":200},{"startTime":222041,"duration":184},{"startTime":222242,"duration":786},{"startTime":223078,"duration":184},{"startTime":223278,"duration":50},{"startTime":224013,"duration":368},{"startTime":224399,"duration":49},{"startTime":224498,"duration":84},{"startTime":224716,"duration":33},{"startTime":224766,"duration":167},{"startTime":225234,"duration":151},{"startTime":225702,"duration":234},{"startTime":225953,"duration":671},{"startTime":226657,"duration":585},{"startTime":227927,"duration":401},{"startTime":228412,"duration":100},{"startTime":228680,"duration":200},{"startTime":229097,"duration":34},{"startTime":229147,"duration":168},{"startTime":229649,"duration":200},{"startTime":229882,"duration":185},{"startTime":230099,"duration":435},{"startTime":230585,"duration":250},{"startTime":230902,"duration":103},{"startTime":231021,"duration":17},{"startTime":231138,"duration":134},{"startTime":231623,"duration":217},{"startTime":231874,"duration":351},{"startTime":232375,"duration":67},{"startTime":232643,"duration":133}],
          guitar: [{"startTime":110907,"duration":134},{"startTime":111408,"duration":50},{"startTime":111878,"duration":168},{"startTime":112129,"duration":67},{"startTime":112881,"duration":117},{"startTime":113132,"duration":101},{"startTime":113367,"duration":49},{"startTime":113868,"duration":117},{"startTime":114101,"duration":117},{"startTime":114603,"duration":100},{"startTime":114854,"duration":133},{"startTime":115104,"duration":50},{"startTime":115321,"duration":117},{"startTime":115789,"duration":84},{"startTime":116809,"duration":119},{"startTime":117313,"duration":67},{"startTime":117797,"duration":84},{"startTime":118048,"duration":50},{"startTime":118299,"duration":83},{"startTime":118533,"duration":66},{"startTime":118783,"duration":101},{"startTime":119268,"duration":100},{"startTime":119536,"duration":16},{"startTime":119737,"duration":82},{"startTime":119987,"duration":50},{"startTime":120254,"duration":84},{"startTime":120505,"duration":68},{"startTime":120756,"duration":67},{"startTime":121224,"duration":117},{"startTime":121725,"duration":83},{"startTime":121995,"duration":50},{"startTime":122229,"duration":83},{"startTime":122480,"duration":66},{"startTime":122713,"duration":151},{"startTime":123215,"duration":67},{"startTime":123699,"duration":68},{"startTime":123950,"duration":67},{"startTime":165986,"duration":100},{"startTime":166237,"duration":33},{"startTime":166471,"duration":84},{"startTime":166955,"duration":103},{"startTime":167944,"duration":83},{"startTime":168195,"duration":33},{"startTime":168446,"duration":33},{"startTime":169181,"duration":17},{"startTime":169431,"duration":51},{"startTime":171888,"duration":34},{"startTime":172125,"duration":33},{"startTime":172375,"duration":51},{"startTime":172877,"duration":33},{"startTime":173378,"duration":17},{"startTime":173846,"duration":51},{"startTime":174347,"duration":67},{"startTime":175335,"duration":48},{"startTime":175567,"duration":68},{"startTime":175818,"duration":100},{"startTime":176320,"duration":33},{"startTime":176804,"duration":50},{"startTime":177291,"duration":84},{"startTime":177793,"duration":84},{"startTime":179263,"duration":85},{"startTime":179748,"duration":100},{"startTime":180233,"duration":100},{"startTime":180731,"duration":20},{"startTime":180985,"duration":50},{"startTime":181486,"duration":34},{"startTime":181720,"duration":100},{"startTime":182217,"duration":34},{"startTime":182468,"duration":34},{"startTime":182703,"duration":83},{"startTime":182936,"duration":84},{"startTime":183672,"duration":117},{"startTime":183923,"duration":116},{"startTime":184173,"duration":67},{"startTime":184658,"duration":117},{"startTime":184908,"duration":102},{"startTime":185410,"duration":67},{"startTime":185661,"duration":100},{"startTime":186129,"duration":84},{"startTime":186630,"duration":84},{"startTime":187618,"duration":151},{"startTime":188120,"duration":18},{"startTime":188622,"duration":49},{"startTime":188855,"duration":50},{"startTime":189106,"duration":100},{"startTime":189340,"duration":50},{"startTime":189591,"duration":83},{"startTime":189824,"duration":67},{"startTime":190076,"duration":32},{"startTime":190828,"duration":33},{"startTime":191061,"duration":67},{"startTime":191312,"duration":83},{"startTime":191563,"duration":33},{"startTime":192047,"duration":86},{"startTime":192535,"duration":83},{"startTime":193036,"duration":67},{"startTime":193287,"duration":50},{"startTime":193521,"duration":100},{"startTime":194005,"duration":84},{"startTime":194506,"duration":34},{"startTime":194758,"duration":66},{"startTime":195493,"duration":117},{"startTime":195743,"duration":84},{"startTime":195978,"duration":33}],
          hook: [{"startTime":71999,"duration":50},{"startTime":72367,"duration":101},{"startTime":72484,"duration":34},{"startTime":72618,"duration":318},{"startTime":73002,"duration":67},{"startTime":73086,"duration":17},{"startTime":73236,"duration":51},{"startTime":73487,"duration":50},{"startTime":73554,"duration":17},{"startTime":73587,"duration":485},{"startTime":74339,"duration":16},{"startTime":74406,"duration":217},{"startTime":74690,"duration":17},{"startTime":75776,"duration":18},{"startTime":76010,"duration":50},{"startTime":76428,"duration":50},{"startTime":76645,"duration":270},{"startTime":76948,"duration":17},{"startTime":76982,"duration":117},{"startTime":77116,"duration":33},{"startTime":77233,"duration":50},{"startTime":77400,"duration":150},{"startTime":77567,"duration":17},{"startTime":77600,"duration":468},{"startTime":78253,"duration":16},{"startTime":78369,"duration":51},{"startTime":78537,"duration":50},{"startTime":78687,"duration":16},{"startTime":79523,"duration":16},{"startTime":79673,"duration":16},{"startTime":79724,"duration":15},{"startTime":79873,"duration":117},{"startTime":80342,"duration":50},{"startTime":80508,"duration":67},{"startTime":80592,"duration":17},{"startTime":80628,"duration":47},{"startTime":80842,"duration":85},{"startTime":81010,"duration":34},{"startTime":81060,"duration":84},{"startTime":81278,"duration":83},{"startTime":81411,"duration":17},{"startTime":81445,"duration":871},{"startTime":82333,"duration":67},{"startTime":82417,"duration":84},{"startTime":83554,"duration":66},{"startTime":84255,"duration":67},{"startTime":84356,"duration":32},{"startTime":84472,"duration":17},{"startTime":84505,"duration":84},{"startTime":84622,"duration":135},{"startTime":84873,"duration":33},{"startTime":85057,"duration":50},{"startTime":85225,"duration":183},{"startTime":85425,"duration":184},{"startTime":85626,"duration":183},{"startTime":85826,"duration":67},{"startTime":86177,"duration":83},{"startTime":86360,"duration":67},{"startTime":86495,"duration":16},{"startTime":87215,"duration":17},{"startTime":87349,"duration":16},{"startTime":87483,"duration":33},{"startTime":87533,"duration":50},{"startTime":87684,"duration":166},{"startTime":87868,"duration":16},{"startTime":95307,"duration":17},{"startTime":95340,"duration":1154},{"startTime":96527,"duration":33},{"startTime":96577,"duration":17},{"startTime":98685,"duration":101},{"startTime":98852,"duration":252},{"startTime":99136,"duration":1171},{"startTime":100390,"duration":50},{"startTime":103284,"duration":368},{"startTime":103836,"duration":100},{"startTime":104003,"duration":267},{"startTime":106760,"duration":153},{"startTime":107030,"duration":16},{"startTime":107214,"duration":234},{"startTime":107464,"duration":1304},{"startTime":108802,"duration":116},{"startTime":111175,"duration":151},{"startTime":111342,"duration":435},{"startTime":111862,"duration":34},{"startTime":112013,"duration":50},{"startTime":112598,"duration":17},{"startTime":119387,"duration":467},{"startTime":119870,"duration":218},{"startTime":120121,"duration":335},{"startTime":120472,"duration":17},{"startTime":120505,"duration":67},{"startTime":120640,"duration":33},{"startTime":127293,"duration":34},{"startTime":127410,"duration":151},{"startTime":127844,"duration":34},{"startTime":128012,"duration":219},{"startTime":128248,"duration":50},{"startTime":128332,"duration":651},{"startTime":129017,"duration":34},{"startTime":129151,"duration":33},{"startTime":129301,"duration":133},{"startTime":129451,"duration":1103},{"startTime":130638,"duration":50},{"startTime":131458,"duration":16},{"startTime":131557,"duration":17},{"startTime":131724,"duration":51},{"startTime":131808,"duration":353},{"startTime":132276,"duration":50},{"startTime":132360,"duration":33},{"startTime":132460,"duration":16},{"startTime":132510,"duration":234},{"startTime":132861,"duration":83},{"startTime":132961,"duration":67},{"startTime":133231,"duration":17},{"startTime":133265,"duration":250},{"startTime":133833,"duration":120},{"startTime":134317,"duration":318},{"startTime":135420,"duration":154},{"startTime":135671,"duration":100},{"startTime":135788,"duration":84},{"startTime":135905,"duration":35},{"startTime":136005,"duration":67},{"startTime":136206,"duration":33},{"startTime":136290,"duration":351},{"startTime":136757,"duration":17},{"startTime":137159,"duration":183},{"startTime":137660,"duration":317},{"startTime":139201,"duration":70},{"startTime":139308,"duration":43},{"startTime":139924,"duration":30},{"startTime":140187,"duration":218},{"startTime":140823,"duration":199},{"startTime":141039,"duration":301},{"startTime":141657,"duration":17},{"startTime":141791,"duration":886},{"startTime":159951,"duration":66},{"startTime":160970,"duration":435},{"startTime":161505,"duration":50},{"startTime":165803,"duration":84},{"startTime":198274,"duration":167},{"startTime":198559,"duration":82},{"startTime":198658,"duration":50},{"startTime":198742,"duration":83},{"startTime":198892,"duration":17},{"startTime":198925,"duration":35},{"startTime":199294,"duration":33},{"startTime":199394,"duration":83},{"startTime":199511,"duration":133},{"startTime":199765,"duration":30},{"startTime":199811,"duration":18},{"startTime":199880,"duration":35},{"startTime":199931,"duration":34},{"startTime":200250,"duration":300},{"startTime":200566,"duration":17},{"startTime":201453,"duration":17},{"startTime":201486,"duration":49},{"startTime":202187,"duration":51},{"startTime":202254,"duration":83},{"startTime":202354,"duration":184},{"startTime":202789,"duration":87},{"startTime":202956,"duration":34},{"startTime":203056,"duration":34},{"startTime":203158,"duration":22},{"startTime":203340,"duration":84},{"startTime":203508,"duration":83},{"startTime":203608,"duration":68},{"startTime":203726,"duration":216},{"startTime":203992,"duration":33},{"startTime":204160,"duration":304},{"startTime":205265,"duration":67},{"startTime":205833,"duration":84},{"startTime":205967,"duration":17},{"startTime":206234,"duration":101},{"startTime":206418,"duration":33},{"startTime":206485,"duration":67},{"startTime":206769,"duration":50},{"startTime":206836,"duration":50},{"startTime":206903,"duration":17},{"startTime":207054,"duration":33},{"startTime":207354,"duration":50},{"startTime":207505,"duration":150},{"startTime":207755,"duration":251},{"startTime":208022,"duration":84},{"startTime":208123,"duration":234},{"startTime":208791,"duration":36},{"startTime":208858,"duration":50},{"startTime":209243,"duration":18},{"startTime":209277,"duration":33},{"startTime":210030,"duration":51},{"startTime":211067,"duration":17},{"startTime":211234,"duration":301},{"startTime":211551,"duration":351},{"startTime":211969,"duration":67},{"startTime":213942,"duration":16},{"startTime":213975,"duration":169},{"startTime":214192,"duration":17},{"startTime":214242,"duration":17},{"startTime":214343,"duration":17},{"startTime":214393,"duration":385},{"startTime":214930,"duration":368},{"startTime":215348,"duration":167},{"startTime":215531,"duration":302},{"startTime":215849,"duration":51},{"startTime":215933,"duration":18},{"startTime":216033,"duration":200},{"startTime":216268,"duration":49},{"startTime":216368,"duration":33},{"startTime":216484,"duration":150},{"startTime":216685,"duration":83},{"startTime":216785,"duration":184},{"startTime":216986,"duration":83},{"startTime":217120,"duration":100},{"startTime":217921,"duration":17},{"startTime":218055,"duration":452},{"startTime":218590,"duration":52},{"startTime":218678,"duration":264},{"startTime":218993,"duration":651},{"startTime":219660,"duration":16},{"startTime":219693,"duration":169},{"startTime":219911,"duration":16},{"startTime":219944,"duration":437},{"startTime":220398,"duration":17},{"startTime":220431,"duration":17},{"startTime":220481,"duration":117},{"startTime":220631,"duration":17},{"startTime":221024,"duration":226},{"startTime":221868,"duration":18},{"startTime":222321,"duration":417},{"startTime":222771,"duration":33},{"startTime":222821,"duration":468},{"startTime":223356,"duration":67},{"startTime":223694,"duration":214},{"startTime":224009,"duration":307},{"startTime":224375,"duration":34},{"startTime":224459,"duration":50},{"startTime":225714,"duration":117},{"startTime":226015,"duration":17},{"startTime":226049,"duration":251},{"startTime":226767,"duration":870},{"startTime":227654,"duration":36},{"startTime":227705,"duration":65},{"startTime":227788,"duration":49},{"startTime":227971,"duration":17},{"startTime":228439,"duration":17},{"startTime":228540,"duration":33}],
          kick: [{"startTime":24636,"duration":234},{"startTime":25121,"duration":401},{"startTime":25605,"duration":122},{"startTime":25839,"duration":151},{"startTime":26074,"duration":389},{"startTime":27076,"duration":187},{"startTime":27327,"duration":137},{"startTime":27544,"duration":84},{"startTime":27796,"duration":82},{"startTime":28029,"duration":235},{"startTime":28566,"duration":184},{"startTime":29034,"duration":209},{"startTime":29286,"duration":133},{"startTime":29569,"duration":18},{"startTime":29769,"duration":118},{"startTime":30071,"duration":133},{"startTime":30271,"duration":83},{"startTime":31023,"duration":318},{"startTime":31508,"duration":133},{"startTime":31742,"duration":117},{"startTime":32009,"duration":202},{"startTime":32494,"duration":188},{"startTime":33012,"duration":121},{"startTime":33246,"duration":88},{"startTime":33497,"duration":86},{"startTime":33767,"duration":33},{"startTime":33984,"duration":200},{"startTime":34201,"duration":134},{"startTime":34937,"duration":234},{"startTime":35187,"duration":119},{"startTime":35438,"duration":100},{"startTime":35689,"duration":116},{"startTime":35922,"duration":237},{"startTime":36424,"duration":152},{"startTime":36925,"duration":184},{"startTime":37184,"duration":31},{"startTime":37661,"duration":100},{"startTime":37912,"duration":166},{"startTime":38145,"duration":151},{"startTime":38900,"duration":184},{"startTime":39100,"duration":153},{"startTime":39384,"duration":84},{"startTime":39611,"duration":80},{"startTime":39869,"duration":185},{"startTime":40370,"duration":134},{"startTime":40855,"duration":137},{"startTime":41122,"duration":22},{"startTime":41340,"duration":67},{"startTime":41591,"duration":83},{"startTime":41841,"duration":169},{"startTime":42092,"duration":101},{"startTime":42811,"duration":200},{"startTime":43061,"duration":88},{"startTime":43312,"duration":117},{"startTime":43565,"duration":50},{"startTime":43799,"duration":203},{"startTime":44300,"duration":118},{"startTime":44819,"duration":134},{"startTime":45052,"duration":92},{"startTime":45303,"duration":84},{"startTime":45537,"duration":101},{"startTime":45838,"duration":108},{"startTime":46022,"duration":104},{"startTime":46774,"duration":134},{"startTime":47008,"duration":83},{"startTime":47259,"duration":83},{"startTime":47493,"duration":116},{"startTime":47744,"duration":184},{"startTime":48262,"duration":102},{"startTime":48731,"duration":185},{"startTime":48999,"duration":17},{"startTime":49234,"duration":116},{"startTime":49484,"duration":67},{"startTime":49735,"duration":155},{"startTime":49952,"duration":117},{"startTime":50687,"duration":168},{"startTime":50921,"duration":100},{"startTime":51172,"duration":117},{"startTime":51441,"duration":72},{"startTime":51690,"duration":142},{"startTime":52158,"duration":167},{"startTime":52710,"duration":100},{"startTime":52910,"duration":121},{"startTime":53161,"duration":150},{"startTime":53412,"duration":50},{"startTime":53648,"duration":171},{"startTime":53905,"duration":32},{"startTime":54133,"duration":133},{"startTime":54618,"duration":166},{"startTime":55152,"duration":151},{"startTime":55369,"duration":136},{"startTime":55620,"duration":251},{"startTime":56140,"duration":133},{"startTime":56606,"duration":191},{"startTime":56832,"duration":143},{"startTime":57090,"duration":101},{"startTime":57342,"duration":33},{"startTime":57575,"duration":170},{"startTime":57810,"duration":134},{"startTime":58546,"duration":168},{"startTime":59032,"duration":117},{"startTime":59283,"duration":66},{"startTime":59533,"duration":184},{"startTime":60018,"duration":171},{"startTime":60520,"duration":200},{"startTime":60770,"duration":69},{"startTime":61021,"duration":83},{"startTime":61255,"duration":116},{"startTime":61505,"duration":201},{"startTime":61739,"duration":123},{"startTime":62475,"duration":167},{"startTime":62692,"duration":135},{"startTime":62976,"duration":50},{"startTime":63460,"duration":171},{"startTime":63932,"duration":135},{"startTime":64433,"duration":200},{"startTime":64700,"duration":101},{"startTime":64951,"duration":133},{"startTime":65185,"duration":102},{"startTime":65452,"duration":167},{"startTime":65669,"duration":151},{"startTime":66438,"duration":201},{"startTime":66689,"duration":117},{"startTime":66939,"duration":67},{"startTime":67424,"duration":168},{"startTime":67926,"duration":119},{"startTime":68410,"duration":134},{"startTime":68647,"duration":83},{"startTime":68881,"duration":117},{"startTime":69131,"duration":67},{"startTime":69382,"duration":186},{"startTime":69616,"duration":136},{"startTime":70368,"duration":150},{"startTime":70836,"duration":117},{"startTime":71070,"duration":67},{"startTime":71321,"duration":184},{"startTime":71822,"duration":151},{"startTime":72323,"duration":168},{"startTime":72558,"duration":85},{"startTime":72809,"duration":101},{"startTime":73059,"duration":84},{"startTime":73310,"duration":184},{"startTime":73544,"duration":88},{"startTime":74298,"duration":184},{"startTime":74533,"duration":85},{"startTime":74800,"duration":85},{"startTime":75037,"duration":51},{"startTime":75284,"duration":201},{"startTime":75803,"duration":87},{"startTime":76270,"duration":184},{"startTime":76521,"duration":101},{"startTime":76772,"duration":67},{"startTime":77039,"duration":17},{"startTime":77323,"duration":67},{"startTime":77507,"duration":70},{"startTime":78226,"duration":201},{"startTime":78460,"duration":86},{"startTime":78746,"duration":33},{"startTime":78963,"duration":67},{"startTime":79214,"duration":134},{"startTime":79699,"duration":134},{"startTime":80217,"duration":117},{"startTime":80936,"duration":83},{"startTime":81170,"duration":200},{"startTime":81420,"duration":118},{"startTime":82172,"duration":151},{"startTime":82440,"duration":66},{"startTime":82674,"duration":83},{"startTime":82908,"duration":87},{"startTime":83176,"duration":183},{"startTime":83644,"duration":119},{"startTime":84147,"duration":134},{"startTime":84381,"duration":102},{"startTime":84632,"duration":134},{"startTime":84882,"duration":103},{"startTime":85150,"duration":117},{"startTime":85334,"duration":118},{"startTime":86120,"duration":183},{"startTime":86587,"duration":153},{"startTime":86838,"duration":167},{"startTime":87105,"duration":102},{"startTime":87373,"duration":169},{"startTime":87590,"duration":171},{"startTime":88058,"duration":219},{"startTime":88322,"duration":59},{"startTime":88543,"duration":133},{"startTime":88779,"duration":50},{"startTime":89029,"duration":185},{"startTime":89280,"duration":101},{"startTime":90016,"duration":201},{"startTime":90250,"duration":134},{"startTime":90501,"duration":133},{"startTime":90734,"duration":134},{"startTime":91002,"duration":169},{"startTime":91486,"duration":152},{"startTime":91971,"duration":184},{"startTime":92207,"duration":103},{"startTime":92456,"duration":120},{"startTime":92690,"duration":134},{"startTime":92940,"duration":218},{"startTime":93175,"duration":102},{"startTime":93425,"duration":135},{"startTime":93929,"duration":201},{"startTime":94163,"duration":100},{"startTime":94414,"duration":134},{"startTime":94715,"duration":67},{"startTime":94851,"duration":48},{"startTime":94915,"duration":101},{"startTime":95049,"duration":603},{"startTime":95886,"duration":333},{"startTime":96353,"duration":351},{"startTime":96854,"duration":351},{"startTime":97339,"duration":222},{"startTime":97840,"duration":221},{"startTime":98090,"duration":118},{"startTime":98325,"duration":875},{"startTime":99313,"duration":251},{"startTime":99815,"duration":167},{"startTime":100282,"duration":251},{"startTime":100550,"duration":111},{"startTime":100784,"duration":200},{"startTime":101018,"duration":134},{"startTime":101269,"duration":222},{"startTime":101770,"duration":205},{"startTime":102254,"duration":319},{"startTime":102623,"duration":491},{"startTime":103241,"duration":219},{"startTime":103725,"duration":255},{"startTime":104229,"duration":206},{"startTime":104467,"duration":130},{"startTime":104714,"duration":234},{"startTime":104981,"duration":68},{"startTime":105215,"duration":223},{"startTime":105717,"duration":250},{"startTime":106201,"duration":204},{"startTime":106436,"duration":83},{"startTime":106569,"duration":86},{"startTime":106669,"duration":234},{"startTime":106920,"duration":150},{"startTime":107187,"duration":237},{"startTime":107672,"duration":239},{"startTime":108157,"duration":250},{"startTime":108424,"duration":134},{"startTime":108658,"duration":357},{"startTime":109145,"duration":236},{"startTime":109647,"duration":217},{"startTime":110148,"duration":206},{"startTime":110370,"duration":648},{"startTime":111117,"duration":206},{"startTime":111586,"duration":251},{"startTime":112087,"duration":158},{"startTime":112354,"duration":84},{"startTime":112589,"duration":337},{"startTime":113107,"duration":202},{"startTime":113574,"duration":220},{"startTime":114078,"duration":219},{"startTime":114312,"duration":51},{"startTime":114446,"duration":83},{"startTime":114546,"duration":223},{"startTime":114800,"duration":119},{"startTime":115047,"duration":237},{"startTime":115532,"duration":235},{"startTime":116034,"duration":237},{"startTime":116284,"duration":122},{"startTime":116535,"duration":222},{"startTime":116771,"duration":78},{"startTime":117019,"duration":234},{"startTime":117521,"duration":234},{"startTime":118005,"duration":719},{"startTime":118738,"duration":138},{"startTime":118977,"duration":240},{"startTime":119462,"duration":264},{"startTime":119963,"duration":213},{"startTime":120210,"duration":87},{"startTime":120465,"duration":241},{"startTime":120737,"duration":34},{"startTime":120983,"duration":234},{"startTime":121468,"duration":251},{"startTime":121969,"duration":205},{"startTime":122352,"duration":74},{"startTime":122458,"duration":397},{"startTime":122955,"duration":231},{"startTime":123423,"duration":284},{"startTime":123943,"duration":219},{"startTime":124180,"duration":125},{"startTime":124428,"duration":334},{"startTime":126400,"duration":83},{"startTime":126517,"duration":33},{"startTime":126568,"duration":16},{"startTime":126651,"duration":401},{"startTime":127353,"duration":217},{"startTime":127587,"duration":120},{"startTime":127837,"duration":151},{"startTime":128072,"duration":67},{"startTime":128322,"duration":224},{"startTime":128562,"duration":150},{"startTime":129328,"duration":200},{"startTime":129578,"duration":117},{"startTime":129812,"duration":119},{"startTime":130063,"duration":100},{"startTime":130313,"duration":218},{"startTime":130815,"duration":201},{"startTime":131316,"duration":170},{"startTime":131582,"duration":55},{"startTime":131818,"duration":85},{"startTime":132303,"duration":166},{"startTime":132536,"duration":138},{"startTime":133272,"duration":200},{"startTime":133506,"duration":121},{"startTime":133773,"duration":186},{"startTime":134009,"duration":118},{"startTime":134260,"duration":224},{"startTime":134745,"duration":169},{"startTime":135246,"duration":184},{"startTime":135497,"duration":117},{"startTime":135731,"duration":101},{"startTime":136216,"duration":401},{"startTime":137202,"duration":217},{"startTime":137436,"duration":83},{"startTime":137687,"duration":150},{"startTime":137953,"duration":69},{"startTime":138189,"duration":201},{"startTime":138689,"duration":100},{"startTime":139193,"duration":201},{"startTime":139444,"duration":58},{"startTime":139695,"duration":83},{"startTime":139962,"duration":33},{"startTime":140179,"duration":218},{"startTime":140414,"duration":167},{"startTime":141132,"duration":217},{"startTime":141366,"duration":133},{"startTime":141616,"duration":119},{"startTime":142118,"duration":203},{"startTime":142619,"duration":50},{"startTime":143171,"duration":17},{"startTime":144126,"duration":50},{"startTime":147084,"duration":67},{"startTime":147318,"duration":16},{"startTime":149058,"duration":50},{"startTime":149510,"duration":33},{"startTime":150044,"duration":34},{"startTime":150496,"duration":17},{"startTime":150529,"duration":17},{"startTime":151482,"duration":50},{"startTime":152000,"duration":67},{"startTime":152201,"duration":68},{"startTime":152969,"duration":84},{"startTime":153437,"duration":50},{"startTime":154443,"duration":33},{"startTime":154961,"duration":50},{"startTime":156148,"duration":69},{"startTime":156883,"duration":117},{"startTime":157117,"duration":52},{"startTime":157869,"duration":117},{"startTime":158136,"duration":84},{"startTime":158354,"duration":200},{"startTime":158855,"duration":337},{"startTime":159342,"duration":17},{"startTime":159576,"duration":84},{"startTime":159843,"duration":173},{"startTime":160062,"duration":83},{"startTime":160796,"duration":167},{"startTime":161280,"duration":102},{"startTime":161548,"duration":35},{"startTime":161766,"duration":217},{"startTime":162251,"duration":153},{"startTime":162769,"duration":166},{"startTime":163021,"duration":16},{"startTime":163253,"duration":117},{"startTime":163520,"duration":34},{"startTime":163754,"duration":173},{"startTime":163974,"duration":100},{"startTime":164225,"duration":134},{"startTime":164726,"duration":189},{"startTime":164964,"duration":101},{"startTime":165211,"duration":137},{"startTime":165515,"duration":55},{"startTime":165652,"duration":46},{"startTime":165719,"duration":82},{"startTime":165851,"duration":599},{"startTime":166698,"duration":201},{"startTime":167183,"duration":353},{"startTime":167668,"duration":344},{"startTime":168170,"duration":221},{"startTime":168654,"duration":222},{"startTime":169157,"duration":196},{"startTime":169413,"duration":52},{"startTime":169527,"duration":334},{"startTime":169894,"duration":116},{"startTime":170127,"duration":234},{"startTime":170628,"duration":223},{"startTime":171130,"duration":172},{"startTime":171615,"duration":200},{"startTime":171851,"duration":37},{"startTime":172106,"duration":244},{"startTime":172600,"duration":268},{"startTime":173086,"duration":199},{"startTime":173335,"duration":59},{"startTime":173475,"duration":69},{"startTime":173574,"duration":235},{"startTime":173825,"duration":149},{"startTime":174073,"duration":240},{"startTime":174576,"duration":217},{"startTime":175059,"duration":218},{"startTime":175327,"duration":83},{"startTime":175561,"duration":189},{"startTime":176046,"duration":234},{"startTime":176547,"duration":189},{"startTime":177015,"duration":203},{"startTime":177266,"duration":105},{"startTime":177387,"duration":347},{"startTime":177750,"duration":84},{"startTime":178001,"duration":238},{"startTime":178503,"duration":221},{"startTime":178971,"duration":224},{"startTime":179223,"duration":101},{"startTime":179474,"duration":239},{"startTime":179730,"duration":33},{"startTime":179975,"duration":177},{"startTime":180460,"duration":223},{"startTime":180961,"duration":238},{"startTime":181229,"duration":68},{"startTime":181347,"duration":83},{"startTime":181448,"duration":391},{"startTime":181965,"duration":229},{"startTime":182433,"duration":235},{"startTime":182918,"duration":302},{"startTime":183402,"duration":234},{"startTime":183669,"duration":86},{"startTime":183903,"duration":204},{"startTime":184358,"duration":238},{"startTime":184875,"duration":205},{"startTime":185126,"duration":117},{"startTime":185261,"duration":101},{"startTime":185377,"duration":302},{"startTime":185861,"duration":223},{"startTime":186346,"duration":234},{"startTime":186847,"duration":221},{"startTime":187083,"duration":31},{"startTime":187349,"duration":204},{"startTime":187599,"duration":84},{"startTime":187834,"duration":234},{"startTime":188335,"duration":173},{"startTime":188819,"duration":226},{"startTime":189061,"duration":120},{"startTime":189200,"duration":76},{"startTime":189308,"duration":232},{"startTime":189808,"duration":222},{"startTime":190293,"duration":222},{"startTime":190760,"duration":220},{"startTime":191045,"duration":69},{"startTime":191296,"duration":183},{"startTime":191529,"duration":50},{"startTime":191780,"duration":206},{"startTime":192282,"duration":214},{"startTime":192783,"duration":210},{"startTime":193023,"duration":65},{"startTime":193167,"duration":50},{"startTime":193268,"duration":217},{"startTime":193501,"duration":85},{"startTime":193769,"duration":218},{"startTime":194257,"duration":183},{"startTime":194741,"duration":205},{"startTime":194978,"duration":81},{"startTime":195225,"duration":221},{"startTime":195463,"duration":50},{"startTime":195743,"duration":86},{"startTime":195961,"duration":184},{"startTime":196211,"duration":173},{"startTime":196464,"duration":208},{"startTime":196701,"duration":247},{"startTime":196963,"duration":117},{"startTime":197114,"duration":183},{"startTime":197331,"duration":574},{"startTime":198166,"duration":211},{"startTime":198416,"duration":92},{"startTime":198652,"duration":150},{"startTime":198902,"duration":88},{"startTime":199157,"duration":182},{"startTime":199372,"duration":168},{"startTime":200125,"duration":217},{"startTime":200375,"duration":17},{"startTime":200626,"duration":123},{"startTime":200877,"duration":83},{"startTime":201111,"duration":217},{"startTime":201612,"duration":173},{"startTime":202130,"duration":170},{"startTime":202352,"duration":133},{"startTime":202615,"duration":100},{"startTime":202866,"duration":83},{"startTime":203099,"duration":198},{"startTime":203345,"duration":139},{"startTime":204104,"duration":167},{"startTime":204305,"duration":123},{"startTime":204573,"duration":134},{"startTime":204823,"duration":119},{"startTime":205091,"duration":184},{"startTime":205559,"duration":183},{"startTime":206060,"duration":184},{"startTime":206311,"duration":108},{"startTime":206545,"duration":117},{"startTime":206801,"duration":97},{"startTime":207030,"duration":419},{"startTime":208016,"duration":327},{"startTime":208507,"duration":144},{"startTime":208751,"duration":90},{"startTime":209002,"duration":237},{"startTime":209505,"duration":184},{"startTime":209990,"duration":336},{"startTime":210491,"duration":123},{"startTime":210741,"duration":68},{"startTime":210976,"duration":214},{"startTime":211208,"duration":121},{"startTime":211461,"duration":134},{"startTime":211879,"duration":33},{"startTime":211929,"duration":234},{"startTime":212179,"duration":102},{"startTime":212413,"duration":201},{"startTime":212945,"duration":140},{"startTime":213166,"duration":172},{"startTime":213419,"duration":195},{"startTime":213919,"duration":219},{"startTime":214171,"duration":83},{"startTime":214405,"duration":173},{"startTime":214656,"duration":138},{"startTime":214889,"duration":402},{"startTime":215876,"duration":350},{"startTime":216364,"duration":123},{"startTime":216627,"duration":69},{"startTime":216862,"duration":233},{"startTime":217347,"duration":196},{"startTime":217905,"duration":351},{"startTime":218368,"duration":122},{"startTime":218600,"duration":101},{"startTime":218834,"duration":267},{"startTime":219118,"duration":36},{"startTime":219321,"duration":184},{"startTime":219839,"duration":67},{"startTime":219957,"duration":477},{"startTime":220708,"duration":86},{"startTime":220815,"duration":665},{"startTime":221794,"duration":322},{"startTime":222263,"duration":166},{"startTime":222530,"duration":68},{"startTime":222763,"duration":359},{"startTime":223266,"duration":166},{"startTime":223750,"duration":212},{"startTime":223991,"duration":88},{"startTime":224237,"duration":122},{"startTime":224504,"duration":17},{"startTime":224538,"duration":50},{"startTime":224621,"duration":270},{"startTime":224956,"duration":419},{"startTime":225708,"duration":200},{"startTime":225925,"duration":152},{"startTime":226193,"duration":172},{"startTime":226443,"duration":117},{"startTime":226694,"duration":200},{"startTime":226927,"duration":89},{"startTime":227178,"duration":147},{"startTime":227434,"duration":80},{"startTime":227547,"duration":321},{"startTime":227918,"duration":388},{"startTime":228402,"duration":197},{"startTime":228654,"duration":45},{"startTime":228886,"duration":181},{"startTime":229137,"duration":151},{"startTime":229638,"duration":236},{"startTime":229892,"duration":68},{"startTime":230139,"duration":100},{"startTime":230640,"duration":335},{"startTime":231142,"duration":84},{"startTime":231643,"duration":176},{"startTime":231881,"duration":69},{"startTime":232128,"duration":67},{"startTime":232696,"duration":84},{"startTime":232880,"duration":34},{"startTime":233114,"duration":117}],
          mellotron: [{"startTime":72371,"duration":17},{"startTime":72422,"duration":16},{"startTime":72555,"duration":853},{"startTime":73591,"duration":335},{"startTime":74326,"duration":385},{"startTime":74847,"duration":34},{"startTime":75616,"duration":34},{"startTime":76318,"duration":33},{"startTime":76536,"duration":802},{"startTime":77505,"duration":384},{"startTime":78274,"duration":201},{"startTime":78491,"duration":167},{"startTime":78758,"duration":117},{"startTime":79527,"duration":34},{"startTime":79577,"duration":18},{"startTime":79627,"duration":18},{"startTime":79661,"duration":17},{"startTime":79695,"duration":16},{"startTime":80449,"duration":802},{"startTime":81468,"duration":251},{"startTime":82186,"duration":402},{"startTime":82622,"duration":166},{"startTime":83457,"duration":16},{"startTime":83624,"duration":17},{"startTime":84393,"duration":855},{"startTime":85398,"duration":337},{"startTime":86150,"duration":384},{"startTime":86568,"duration":151},{"startTime":88373,"duration":803},{"startTime":99575,"duration":4432},{"startTime":104023,"duration":34},{"startTime":107469,"duration":4231},{"startTime":115312,"duration":3778},{"startTime":123487,"duration":1220},{"startTime":124724,"duration":33},{"startTime":124808,"duration":33},{"startTime":124891,"duration":136},{"startTime":143185,"duration":17},{"startTime":143252,"duration":17},{"startTime":143369,"duration":835},{"startTime":144355,"duration":401},{"startTime":145093,"duration":200},{"startTime":145310,"duration":184},{"startTime":145594,"duration":117},{"startTime":146530,"duration":17},{"startTime":146563,"duration":18},{"startTime":147316,"duration":853},{"startTime":148318,"duration":385},{"startTime":149071,"duration":50},{"startTime":149138,"duration":50},{"startTime":149506,"duration":233},{"startTime":149755,"duration":68},{"startTime":150276,"duration":151},{"startTime":151246,"duration":819},{"startTime":152265,"duration":335},{"startTime":152967,"duration":401},{"startTime":153485,"duration":134},{"startTime":154237,"duration":50},{"startTime":154304,"duration":16},{"startTime":154371,"duration":17},{"startTime":154939,"duration":17},{"startTime":155176,"duration":819},{"startTime":156178,"duration":268},{"startTime":156880,"duration":134},{"startTime":157031,"duration":33},{"startTime":157097,"duration":151},{"startTime":157415,"duration":117},{"startTime":158117,"duration":34},{"startTime":170391,"duration":3761},{"startTime":178282,"duration":3781},{"startTime":186159,"duration":3911},{"startTime":194033,"duration":4616},{"startTime":198682,"duration":101},{"startTime":198900,"duration":183},{"startTime":199117,"duration":117},{"startTime":199367,"duration":51},{"startTime":199435,"duration":83},{"startTime":200153,"duration":36},{"startTime":200223,"duration":16},{"startTime":200272,"duration":17},{"startTime":200306,"duration":217},{"startTime":200557,"duration":50},{"startTime":200674,"duration":384},{"startTime":201075,"duration":51},{"startTime":201175,"duration":17},{"startTime":201309,"duration":83},{"startTime":201410,"duration":116},{"startTime":201576,"duration":669},{"startTime":202295,"duration":317},{"startTime":202646,"duration":100},{"startTime":202863,"duration":167},{"startTime":203381,"duration":34},{"startTime":204301,"duration":249},{"startTime":204618,"duration":134},{"startTime":204802,"duration":471},{"startTime":205289,"duration":33},{"startTime":205355,"duration":101},{"startTime":205523,"duration":668},{"startTime":206242,"duration":317},{"startTime":206576,"duration":117},{"startTime":206810,"duration":166},{"startTime":207328,"duration":17},{"startTime":208113,"duration":34},{"startTime":208264,"duration":201},{"startTime":208548,"duration":83},{"startTime":208715,"duration":251},{"startTime":209000,"duration":99},{"startTime":209217,"duration":50},{"startTime":209283,"duration":735},{"startTime":210036,"duration":100},{"startTime":210186,"duration":303},{"startTime":210523,"duration":100},{"startTime":210724,"duration":200},{"startTime":210991,"duration":134},{"startTime":211191,"duration":134},{"startTime":212093,"duration":34},{"startTime":212160,"duration":218},{"startTime":212478,"duration":84},{"startTime":212628,"duration":234},{"startTime":213096,"duration":200},{"startTime":213363,"duration":702},{"startTime":214133,"duration":283},{"startTime":214433,"duration":117},{"startTime":214667,"duration":167},{"startTime":215169,"duration":50},{"startTime":215956,"duration":34},{"startTime":216040,"duration":17},{"startTime":216107,"duration":184},{"startTime":216341,"duration":17},{"startTime":216407,"duration":536},{"startTime":217026,"duration":969},{"startTime":218046,"duration":301},{"startTime":218380,"duration":100},{"startTime":218581,"duration":200},{"startTime":218848,"duration":84},{"startTime":219048,"duration":151},{"startTime":219968,"duration":17},{"startTime":220035,"duration":220},{"startTime":220321,"duration":84},{"startTime":220488,"duration":251},{"startTime":220773,"duration":116},{"startTime":220906,"duration":17},{"startTime":220956,"duration":569},{"startTime":221541,"duration":17},{"startTime":221575,"duration":351},{"startTime":221994,"duration":300},{"startTime":222327,"duration":83},{"startTime":222544,"duration":150},{"startTime":222795,"duration":67},{"startTime":222962,"duration":50},{"startTime":223029,"duration":67},{"startTime":223898,"duration":17},{"startTime":223931,"duration":17},{"startTime":223965,"duration":233},{"startTime":224282,"duration":83},{"startTime":224432,"duration":268},{"startTime":224750,"duration":83},{"startTime":224850,"duration":34},{"startTime":224934,"duration":50},{"startTime":225001,"duration":184},{"startTime":225772,"duration":50},{"startTime":225906,"duration":267},{"startTime":226190,"duration":17},{"startTime":226240,"duration":83},{"startTime":226474,"duration":167},{"startTime":226725,"duration":83},{"startTime":226892,"duration":67},{"startTime":226976,"duration":83},{"startTime":227794,"duration":17},{"startTime":227828,"duration":17},{"startTime":227877,"duration":235},{"startTime":228196,"duration":100},{"startTime":228346,"duration":250},{"startTime":228680,"duration":67},{"startTime":228864,"duration":952},{"startTime":233229,"duration":16},{"startTime":233328,"duration":17},{"startTime":233362,"duration":334}],
          perc: [{"startTime":95580,"duration":150},{"startTime":95981,"duration":33},{"startTime":96064,"duration":234},{"startTime":96381,"duration":51},{"startTime":96448,"duration":17},{"startTime":98187,"duration":100},{"startTime":98320,"duration":385},{"startTime":99458,"duration":267},{"startTime":99827,"duration":267},{"startTime":100312,"duration":234},{"startTime":100813,"duration":385},{"startTime":101365,"duration":251},{"startTime":101866,"duration":17},{"startTime":102267,"duration":17},{"startTime":102300,"duration":335},{"startTime":103036,"duration":184},{"startTime":103253,"duration":368},{"startTime":104944,"duration":133},{"startTime":105412,"duration":66},{"startTime":105813,"duration":167},{"startTime":106298,"duration":267},{"startTime":106749,"duration":318},{"startTime":107234,"duration":185},{"startTime":107785,"duration":68},{"startTime":108220,"duration":284},{"startTime":108788,"duration":117},{"startTime":109222,"duration":218},{"startTime":110144,"duration":318},{"startTime":110896,"duration":603},{"startTime":111631,"duration":221},{"startTime":112149,"duration":167},{"startTime":112617,"duration":319},{"startTime":113102,"duration":17},{"startTime":113136,"duration":216},{"startTime":113370,"duration":33},{"startTime":113620,"duration":251},{"startTime":114088,"duration":335},{"startTime":114590,"duration":418},{"startTime":115025,"duration":255},{"startTime":115311,"duration":17},{"startTime":115562,"duration":317},{"startTime":116063,"duration":284},{"startTime":116581,"duration":337},{"startTime":116966,"duration":66},{"startTime":117049,"duration":301},{"startTime":117550,"duration":435},{"startTime":118001,"duration":385},{"startTime":118503,"duration":350},{"startTime":119037,"duration":251},{"startTime":119522,"duration":251},{"startTime":120028,"duration":166},{"startTime":120511,"duration":284},{"startTime":121013,"duration":350},{"startTime":121464,"duration":401},{"startTime":121998,"duration":302},{"startTime":122484,"duration":267},{"startTime":122968,"duration":250},{"startTime":123453,"duration":217},{"startTime":123971,"duration":318},{"startTime":124390,"duration":468},{"startTime":125945,"duration":334},{"startTime":126429,"duration":34},{"startTime":126480,"duration":284},{"startTime":126915,"duration":1269},{"startTime":128369,"duration":250},{"startTime":128836,"duration":401},{"startTime":129255,"duration":16},{"startTime":129371,"duration":83},{"startTime":129488,"duration":67},{"startTime":129839,"duration":17},{"startTime":129873,"duration":336},{"startTime":130343,"duration":435},{"startTime":130794,"duration":67},{"startTime":130895,"duration":284},{"startTime":131296,"duration":53},{"startTime":131364,"duration":317},{"startTime":131714,"duration":83},{"startTime":131814,"duration":201},{"startTime":132148,"duration":17},{"startTime":132616,"duration":769},{"startTime":133837,"duration":50},{"startTime":134271,"duration":518},{"startTime":135142,"duration":585},{"startTime":135760,"duration":134},{"startTime":136429,"duration":16},{"startTime":136462,"duration":384},{"startTime":136897,"duration":83},{"startTime":137298,"duration":50},{"startTime":137398,"duration":602},{"startTime":138324,"duration":14},{"startTime":138413,"duration":88},{"startTime":138806,"duration":49},{"startTime":138869,"duration":1172},{"startTime":140075,"duration":17},{"startTime":140108,"duration":17},{"startTime":140158,"duration":469},{"startTime":140694,"duration":502},{"startTime":141211,"duration":51},{"startTime":141284,"duration":613},{"startTime":142147,"duration":318},{"startTime":164669,"duration":168},{"startTime":166242,"duration":368},{"startTime":166661,"duration":179},{"startTime":168315,"duration":184},{"startTime":168716,"duration":134},{"startTime":169217,"duration":84},{"startTime":169852,"duration":151},{"startTime":170306,"duration":101},{"startTime":171242,"duration":17},{"startTime":171426,"duration":67},{"startTime":171677,"duration":117},{"startTime":173671,"duration":95},{"startTime":174685,"duration":34},{"startTime":175189,"duration":33},{"startTime":175306,"duration":50},{"startTime":175633,"duration":225},{"startTime":177496,"duration":184},{"startTime":177730,"duration":100},{"startTime":178398,"duration":17},{"startTime":179067,"duration":418},{"startTime":179635,"duration":654},{"startTime":181127,"duration":283},{"startTime":181961,"duration":185},{"startTime":182462,"duration":156},{"startTime":182779,"duration":34},{"startTime":182947,"duration":170},{"startTime":183431,"duration":155},{"startTime":183935,"duration":201},{"startTime":184519,"duration":16},{"startTime":184885,"duration":167},{"startTime":185452,"duration":337},{"startTime":185878,"duration":235},{"startTime":186358,"duration":260},{"startTime":187437,"duration":230},{"startTime":187683,"duration":17},{"startTime":187781,"duration":48},{"startTime":187847,"duration":220},{"startTime":188348,"duration":451},{"startTime":188815,"duration":231},{"startTime":189318,"duration":211},{"startTime":189868,"duration":88},{"startTime":189977,"duration":58},{"startTime":190322,"duration":85},{"startTime":190506,"duration":150},{"startTime":190823,"duration":90},{"startTime":190947,"duration":49},{"startTime":191307,"duration":70},{"startTime":191394,"duration":215},{"startTime":191836,"duration":23},{"startTime":191895,"duration":138},{"startTime":192294,"duration":127},{"startTime":192812,"duration":68},{"startTime":193314,"duration":105},{"startTime":193434,"duration":46},{"startTime":193832,"duration":19},{"startTime":193891,"duration":136},{"startTime":194268,"duration":105},{"startTime":194851,"duration":135},{"startTime":197319,"duration":17},{"startTime":197354,"duration":56},{"startTime":197695,"duration":595},{"startTime":198392,"duration":61},{"startTime":198625,"duration":368},{"startTime":199080,"duration":250},{"startTime":199443,"duration":37},{"startTime":200201,"duration":120},{"startTime":201074,"duration":40},{"startTime":201275,"duration":79},{"startTime":202132,"duration":199},{"startTime":202424,"duration":20},{"startTime":203075,"duration":20},{"startTime":203115,"duration":144},{"startTime":204003,"duration":64},{"startTime":204087,"duration":377},{"startTime":204483,"duration":59},{"startTime":204616,"duration":22},{"startTime":205092,"duration":141},{"startTime":205345,"duration":81},{"startTime":205527,"duration":17},{"startTime":206188,"duration":21},{"startTime":206638,"duration":173},{"startTime":207006,"duration":20},{"startTime":207087,"duration":76},{"startTime":207468,"duration":42},{"startTime":207551,"duration":177},{"startTime":208451,"duration":52},{"startTime":208527,"duration":21},{"startTime":208782,"duration":58},{"startTime":209042,"duration":89},{"startTime":209167,"duration":43},{"startTime":209442,"duration":23},{"startTime":210132,"duration":20},{"startTime":210196,"duration":34},{"startTime":210939,"duration":179},{"startTime":212543,"duration":260},{"startTime":213002,"duration":166},{"startTime":213605,"duration":43},{"startTime":213691,"duration":15},{"startTime":213980,"duration":166},{"startTime":214570,"duration":162},{"startTime":214831,"duration":112},{"startTime":214961,"duration":44},{"startTime":215030,"duration":15},{"startTime":215061,"duration":24},{"startTime":216044,"duration":97},{"startTime":216906,"duration":139},{"startTime":217190,"duration":36},{"startTime":217767,"duration":47},{"startTime":218295,"duration":42},{"startTime":218375,"duration":42},{"startTime":218442,"duration":195},{"startTime":218779,"duration":20},{"startTime":218926,"duration":266},{"startTime":219471,"duration":172},{"startTime":219840,"duration":25},{"startTime":219901,"duration":72},{"startTime":219991,"duration":39},{"startTime":220409,"duration":234},{"startTime":220806,"duration":203},{"startTime":221095,"duration":30},{"startTime":221213,"duration":81},{"startTime":221457,"duration":142},{"startTime":221826,"duration":32},{"startTime":221941,"duration":205},{"startTime":222215,"duration":72},{"startTime":222325,"duration":48},{"startTime":222549,"duration":28},{"startTime":222696,"duration":75},{"startTime":222785,"duration":205},{"startTime":223549,"duration":26},{"startTime":223695,"duration":65},{"startTime":223774,"duration":154},{"startTime":224048,"duration":24},{"startTime":224450,"duration":27},{"startTime":224537,"duration":41},{"startTime":224687,"duration":27},{"startTime":224766,"duration":151},{"startTime":225033,"duration":47},{"startTime":225269,"duration":53},{"startTime":225755,"duration":64},{"startTime":226227,"duration":75},{"startTime":226709,"duration":44},{"startTime":226774,"duration":43},{"startTime":227368,"duration":26},{"startTime":227453,"duration":90},{"startTime":227861,"duration":17},{"startTime":228688,"duration":257},{"startTime":229364,"duration":201},{"startTime":229599,"duration":333},{"startTime":230016,"duration":227},{"startTime":230704,"duration":235},{"startTime":231959,"duration":48},{"startTime":232040,"duration":17},{"startTime":232181,"duration":311},{"startTime":232642,"duration":920}],
          prog: [{"startTime":25189,"duration":134},{"startTime":26142,"duration":116},{"startTime":27130,"duration":100},{"startTime":28100,"duration":133},{"startTime":29102,"duration":117},{"startTime":30088,"duration":133},{"startTime":31075,"duration":116},{"startTime":32047,"duration":32},{"startTime":32096,"duration":50},{"startTime":33049,"duration":133},{"startTime":34035,"duration":100},{"startTime":35004,"duration":117},{"startTime":35974,"duration":133},{"startTime":36964,"duration":115},{"startTime":37932,"duration":133},{"startTime":38918,"duration":116},{"startTime":39904,"duration":134},{"startTime":40872,"duration":135},{"startTime":41878,"duration":151},{"startTime":42847,"duration":168},{"startTime":43833,"duration":134},{"startTime":44836,"duration":151},{"startTime":45822,"duration":133},{"startTime":46794,"duration":134},{"startTime":47780,"duration":133},{"startTime":48783,"duration":117},{"startTime":49753,"duration":133},{"startTime":50722,"duration":135},{"startTime":51693,"duration":150},{"startTime":52713,"duration":119},{"startTime":53666,"duration":167},{"startTime":54635,"duration":151},{"startTime":55069,"duration":234},{"startTime":55638,"duration":167},{"startTime":56659,"duration":151},{"startTime":57629,"duration":117},{"startTime":58615,"duration":100},{"startTime":59584,"duration":117},{"startTime":60570,"duration":118},{"startTime":61557,"duration":120},{"startTime":62528,"duration":100},{"startTime":63497,"duration":117},{"startTime":64468,"duration":49},{"startTime":64533,"duration":51},{"startTime":65503,"duration":100},{"startTime":66490,"duration":135},{"startTime":67478,"duration":117},{"startTime":68447,"duration":117},{"startTime":69433,"duration":117},{"startTime":70402,"duration":117},{"startTime":71373,"duration":132},{"startTime":72377,"duration":118},{"startTime":73364,"duration":116},{"startTime":74334,"duration":132},{"startTime":75335,"duration":134},{"startTime":76322,"duration":133},{"startTime":77310,"duration":134},{"startTime":78263,"duration":117},{"startTime":79265,"duration":118},{"startTime":80252,"duration":116},{"startTime":81237,"duration":117},{"startTime":82226,"duration":133},{"startTime":83212,"duration":117},{"startTime":84231,"duration":67},{"startTime":85185,"duration":82},{"startTime":86153,"duration":134},{"startTime":86891,"duration":118},{"startTime":87393,"duration":133},{"startTime":88118,"duration":120},{"startTime":89081,"duration":116},{"startTime":90066,"duration":119},{"startTime":91053,"duration":100},{"startTime":92025,"duration":133},{"startTime":92994,"duration":117},{"startTime":93980,"duration":117},{"startTime":94733,"duration":33},{"startTime":94782,"duration":17},{"startTime":94815,"duration":67},{"startTime":94899,"duration":17},{"startTime":94966,"duration":16},{"startTime":95066,"duration":286},{"startTime":95401,"duration":148},{"startTime":126451,"duration":17},{"startTime":126569,"duration":33},{"startTime":126686,"duration":49},{"startTime":126804,"duration":34},{"startTime":127408,"duration":119},{"startTime":128392,"duration":117},{"startTime":129379,"duration":116},{"startTime":130364,"duration":118},{"startTime":131367,"duration":117},{"startTime":132340,"duration":100},{"startTime":133342,"duration":100},{"startTime":134311,"duration":100},{"startTime":135314,"duration":83},{"startTime":136284,"duration":116},{"startTime":137255,"duration":117},{"startTime":138242,"duration":116},{"startTime":139244,"duration":134},{"startTime":140231,"duration":133},{"startTime":141199,"duration":117},{"startTime":142171,"duration":134},{"startTime":143174,"duration":51},{"startTime":144127,"duration":100},{"startTime":145129,"duration":67},{"startTime":146115,"duration":67},{"startTime":147104,"duration":67},{"startTime":148090,"duration":67},{"startTime":149059,"duration":50},{"startTime":150045,"duration":84},{"startTime":151032,"duration":66},{"startTime":152020,"duration":83},{"startTime":153006,"duration":33},{"startTime":153992,"duration":101},{"startTime":154978,"duration":119},{"startTime":155964,"duration":117},{"startTime":156936,"duration":117},{"startTime":157905,"duration":118},{"startTime":158139,"duration":201},{"startTime":158909,"duration":133},{"startTime":159878,"duration":118},{"startTime":160848,"duration":116},{"startTime":161816,"duration":34},{"startTime":161867,"duration":69},{"startTime":162822,"duration":133},{"startTime":163808,"duration":116},{"startTime":164778,"duration":116},{"startTime":195266,"duration":52},{"startTime":195774,"duration":72},{"startTime":196262,"duration":67},{"startTime":196513,"duration":83},{"startTime":196767,"duration":105},{"startTime":197020,"duration":200},{"startTime":197234,"duration":50},{"startTime":197320,"duration":327},{"startTime":198212,"duration":126},{"startTime":199190,"duration":83},{"startTime":200175,"duration":85},{"startTime":201162,"duration":35},{"startTime":202166,"duration":84},{"startTime":203136,"duration":100},{"startTime":204106,"duration":83},{"startTime":205108,"duration":101},{"startTime":206111,"duration":67},{"startTime":207099,"duration":50},{"startTime":208069,"duration":100},{"startTime":209039,"duration":117},{"startTime":210041,"duration":100},{"startTime":211010,"duration":101},{"startTime":211996,"duration":87},{"startTime":212985,"duration":67},{"startTime":213971,"duration":83},{"startTime":214957,"duration":84},{"startTime":215926,"duration":117},{"startTime":216910,"duration":67},{"startTime":217908,"duration":104},{"startTime":218898,"duration":72},{"startTime":219639,"duration":568},{"startTime":220603,"duration":51},{"startTime":220680,"duration":106},{"startTime":220804,"duration":390},{"startTime":221830,"duration":99},{"startTime":222817,"duration":100},{"startTime":223786,"duration":100},{"startTime":224656,"duration":83},{"startTime":225006,"duration":84},{"startTime":225743,"duration":83},{"startTime":226728,"duration":100},{"startTime":227449,"duration":234},{"startTime":227967,"duration":84},{"startTime":228435,"duration":100},{"startTime":228653,"duration":116},{"startTime":228921,"duration":99},{"startTime":229689,"duration":83},{"startTime":230691,"duration":51},{"startTime":231661,"duration":100},{"startTime":232666,"duration":83}],
          timpani: [{"startTime":12326,"duration":1420},{"startTime":12763,"duration":67},{"startTime":12913,"duration":17},{"startTime":12997,"duration":84},{"startTime":13147,"duration":17},{"startTime":13181,"duration":283},{"startTime":32274,"duration":217},{"startTime":32542,"duration":351},{"startTime":35268,"duration":117},{"startTime":35519,"duration":33},{"startTime":35636,"duration":33},{"startTime":35719,"duration":1004},{"startTime":40114,"duration":254},{"startTime":40418,"duration":301},{"startTime":44078,"duration":518},{"startTime":48143,"duration":16},{"startTime":48176,"duration":417},{"startTime":52222,"duration":318},{"startTime":55952,"duration":184},{"startTime":56169,"duration":384},{"startTime":59077,"duration":1037},{"startTime":63759,"duration":50},{"startTime":63994,"duration":350},{"startTime":67539,"duration":819},{"startTime":71619,"duration":201},{"startTime":71854,"duration":250},{"startTime":73609,"duration":216},{"startTime":75816,"duration":235},{"startTime":79727,"duration":251},{"startTime":81501,"duration":218},{"startTime":83708,"duration":217},{"startTime":86936,"duration":1002},{"startTime":91317,"duration":16},{"startTime":91517,"duration":234},{"startTime":94442,"duration":17},{"startTime":94476,"duration":17},{"startTime":94576,"duration":17},{"startTime":94609,"duration":34},{"startTime":94677,"duration":618},{"startTime":95411,"duration":337},{"startTime":99091,"duration":150},{"startTime":99358,"duration":301},{"startTime":102519,"duration":602},{"startTime":103288,"duration":317},{"startTime":106967,"duration":151},{"startTime":107218,"duration":301},{"startTime":110344,"duration":33},{"startTime":110411,"duration":604},{"startTime":111148,"duration":335},{"startTime":114858,"duration":117},{"startTime":115093,"duration":301},{"startTime":118186,"duration":18},{"startTime":118254,"duration":601},{"startTime":119023,"duration":317},{"startTime":122702,"duration":150},{"startTime":122953,"duration":317},{"startTime":126665,"duration":168},{"startTime":126932,"duration":352},{"startTime":129657,"duration":117},{"startTime":129924,"duration":17},{"startTime":130025,"duration":16},{"startTime":130108,"duration":1005},{"startTime":134539,"duration":184},{"startTime":134790,"duration":351},{"startTime":137534,"duration":100},{"startTime":137785,"duration":16},{"startTime":137884,"duration":34},{"startTime":137952,"duration":1019},{"startTime":142399,"duration":217},{"startTime":142633,"duration":252},{"startTime":144388,"duration":218},{"startTime":146597,"duration":251},{"startTime":150508,"duration":236},{"startTime":152281,"duration":218},{"startTime":154489,"duration":217},{"startTime":157715,"duration":1020},{"startTime":162080,"duration":34},{"startTime":162314,"duration":251},{"startTime":165239,"duration":84},{"startTime":165356,"duration":100},{"startTime":165474,"duration":620},{"startTime":166211,"duration":335},{"startTime":169921,"duration":134},{"startTime":170156,"duration":300},{"startTime":173316,"duration":602},{"startTime":174086,"duration":317},{"startTime":177765,"duration":150},{"startTime":178015,"duration":302},{"startTime":180976,"duration":16},{"startTime":181109,"duration":18},{"startTime":181143,"duration":33},{"startTime":181210,"duration":602},{"startTime":181963,"duration":317},{"startTime":185656,"duration":129},{"startTime":185892,"duration":301},{"startTime":188985,"duration":32},{"startTime":189068,"duration":585},{"startTime":189820,"duration":334},{"startTime":193499,"duration":150},{"startTime":193766,"duration":301},{"startTime":197044,"duration":1003},{"startTime":199434,"duration":385},{"startTime":200370,"duration":167},{"startTime":201643,"duration":318},{"startTime":203364,"duration":318},{"startTime":204267,"duration":217},{"startTime":205337,"duration":50},{"startTime":205571,"duration":319},{"startTime":207294,"duration":334},{"startTime":208214,"duration":217},{"startTime":209267,"duration":166},{"startTime":209533,"duration":251},{"startTime":211241,"duration":317},{"startTime":212144,"duration":217},{"startTime":212728,"duration":34},{"startTime":212779,"duration":1002},{"startTime":215168,"duration":318},{"startTime":216106,"duration":168},{"startTime":217377,"duration":300},{"startTime":219098,"duration":318},{"startTime":220018,"duration":200},{"startTime":221073,"duration":50},{"startTime":221308,"duration":300},{"startTime":223045,"duration":317},{"startTime":223947,"duration":218},{"startTime":225001,"duration":167},{"startTime":225268,"duration":250},{"startTime":226976,"duration":317},{"startTime":227878,"duration":17},{"startTime":227912,"duration":183},{"startTime":228446,"duration":1087}],
          vanguard: [{"startTime":2390,"duration":419},{"startTime":3814,"duration":619},{"startTime":4549,"duration":134},{"startTime":4783,"duration":117},{"startTime":5001,"duration":117},{"startTime":5235,"duration":83},{"startTime":5452,"duration":133},{"startTime":6020,"duration":184},{"startTime":8109,"duration":34},{"startTime":8227,"duration":66},{"startTime":8310,"duration":50},{"startTime":8410,"duration":101},{"startTime":8596,"duration":17},{"startTime":8713,"duration":51},{"startTime":8813,"duration":34},{"startTime":8947,"duration":17},{"startTime":9081,"duration":17},{"startTime":9214,"duration":101},{"startTime":9504,"duration":78},{"startTime":10033,"duration":218},{"startTime":12624,"duration":151},{"startTime":12909,"duration":49},{"startTime":13042,"duration":34},{"startTime":13176,"duration":133},{"startTime":13410,"duration":135},{"startTime":13629,"duration":50},{"startTime":13763,"duration":50},{"startTime":13863,"duration":50},{"startTime":14031,"duration":16},{"startTime":14164,"duration":150},{"startTime":14448,"duration":1304},{"startTime":15869,"duration":167},{"startTime":16119,"duration":50},{"startTime":16253,"duration":151},{"startTime":16487,"duration":50},{"startTime":16604,"duration":67},{"startTime":16755,"duration":50},{"startTime":16905,"duration":50},{"startTime":17005,"duration":34},{"startTime":17155,"duration":68},{"startTime":17256,"duration":33},{"startTime":17407,"duration":150},{"startTime":17674,"duration":67},{"startTime":17807,"duration":34},{"startTime":17974,"duration":134},{"startTime":19883,"duration":50},{"startTime":20049,"duration":117},{"startTime":20300,"duration":51},{"startTime":20383,"duration":34},{"startTime":20534,"duration":117},{"startTime":20751,"duration":17},{"startTime":20869,"duration":49},{"startTime":21002,"duration":17},{"startTime":21135,"duration":151},{"startTime":21403,"duration":150},{"startTime":24849,"duration":33},{"startTime":24982,"duration":34},{"startTime":25116,"duration":16},{"startTime":25266,"duration":33},{"startTime":25366,"duration":17},{"startTime":25502,"duration":15},{"startTime":25634,"duration":34},{"startTime":25735,"duration":16},{"startTime":25885,"duration":117},{"startTime":26119,"duration":67},{"startTime":26235,"duration":18},{"startTime":26369,"duration":17},{"startTime":26503,"duration":34},{"startTime":27322,"duration":17},{"startTime":27489,"duration":21},{"startTime":27607,"duration":50},{"startTime":27756,"duration":101},{"startTime":27874,"duration":33},{"startTime":28007,"duration":34},{"startTime":28124,"duration":201},{"startTime":28375,"duration":67},{"startTime":28509,"duration":33},{"startTime":28645,"duration":133},{"startTime":28896,"duration":50},{"startTime":29013,"duration":33},{"startTime":29131,"duration":33},{"startTime":29280,"duration":16},{"startTime":29397,"duration":50},{"startTime":29515,"duration":32},{"startTime":29664,"duration":134},{"startTime":29932,"duration":51},{"startTime":30049,"duration":33},{"startTime":30216,"duration":34},{"startTime":30350,"duration":33},{"startTime":30501,"duration":32},{"startTime":30634,"duration":16},{"startTime":31854,"duration":67},{"startTime":31971,"duration":33},{"startTime":32138,"duration":34},{"startTime":32272,"duration":284},{"startTime":32957,"duration":201},{"startTime":33259,"duration":132},{"startTime":33475,"duration":203},{"startTime":33747,"duration":165},{"startTime":33978,"duration":134},{"startTime":34229,"duration":186},{"startTime":34556,"duration":158},{"startTime":34831,"duration":134},{"startTime":35818,"duration":150},{"startTime":36052,"duration":200},{"startTime":36285,"duration":151},{"startTime":36536,"duration":134},{"startTime":36753,"duration":184},{"startTime":37020,"duration":134},{"startTime":37289,"duration":99},{"startTime":37530,"duration":109},{"startTime":37756,"duration":134},{"startTime":38024,"duration":116},{"startTime":38274,"duration":386},{"startTime":39697,"duration":167},{"startTime":39981,"duration":167},{"startTime":40266,"duration":350},{"startTime":56100,"duration":484},{"startTime":56651,"duration":151},{"startTime":56868,"duration":151},{"startTime":57069,"duration":150},{"startTime":57336,"duration":84},{"startTime":57538,"duration":99},{"startTime":57771,"duration":134},{"startTime":58022,"duration":150},{"startTime":58239,"duration":133},{"startTime":58473,"duration":134},{"startTime":58726,"duration":117},{"startTime":59161,"duration":66},{"startTime":59261,"duration":50},{"startTime":59395,"duration":150},{"startTime":59562,"duration":16},{"startTime":59595,"duration":50},{"startTime":59746,"duration":16},{"startTime":59846,"duration":33},{"startTime":59963,"duration":17},{"startTime":60097,"duration":66},{"startTime":60180,"duration":34},{"startTime":60347,"duration":117},{"startTime":60581,"duration":118},{"startTime":60832,"duration":151},{"startTime":61033,"duration":33},{"startTime":61217,"duration":83},{"startTime":61417,"duration":17},{"startTime":61584,"duration":201},{"startTime":61801,"duration":18},{"startTime":62737,"duration":51},{"startTime":62922,"duration":16},{"startTime":63038,"duration":50},{"startTime":63171,"duration":337},{"startTime":63573,"duration":136},{"startTime":63843,"duration":83},{"startTime":64027,"duration":133},{"startTime":64277,"duration":84},{"startTime":64495,"duration":83},{"startTime":64695,"duration":150},{"startTime":64912,"duration":151},{"startTime":65146,"duration":84},{"startTime":65297,"duration":33},{"startTime":65447,"duration":68},{"startTime":65547,"duration":50},{"startTime":65698,"duration":401},{"startTime":66166,"duration":167},{"startTime":66467,"duration":167},{"startTime":66734,"duration":100},{"startTime":66851,"duration":334},{"startTime":67469,"duration":251},{"startTime":67854,"duration":335},{"startTime":68222,"duration":50},{"startTime":68391,"duration":267},{"startTime":68742,"duration":67},{"startTime":68859,"duration":318},{"startTime":69243,"duration":34},{"startTime":69377,"duration":156},{"startTime":69619,"duration":163},{"startTime":69857,"duration":122},{"startTime":70097,"duration":117},{"startTime":70335,"duration":280},{"startTime":70681,"duration":186},{"startTime":70932,"duration":719},{"startTime":72202,"duration":66},{"startTime":87101,"duration":284},{"startTime":87508,"duration":161},{"startTime":87719,"duration":50},{"startTime":87852,"duration":118},{"startTime":88086,"duration":101},{"startTime":88270,"duration":117},{"startTime":88487,"duration":84},{"startTime":88688,"duration":84},{"startTime":88924,"duration":84},{"startTime":89142,"duration":183},{"startTime":89426,"duration":134},{"startTime":89677,"duration":385},{"startTime":90144,"duration":1639},{"startTime":92117,"duration":34},{"startTime":92217,"duration":17},{"startTime":92468,"duration":451},{"startTime":93086,"duration":167},{"startTime":93320,"duration":185},{"startTime":93604,"duration":84},{"startTime":93991,"duration":552},{"startTime":94693,"duration":116},{"startTime":94910,"duration":67},{"startTime":95078,"duration":367},{"startTime":95548,"duration":114},{"startTime":95763,"duration":117},{"startTime":95980,"duration":134},{"startTime":96248,"duration":99},{"startTime":96431,"duration":133},{"startTime":96699,"duration":100},{"startTime":96916,"duration":117},{"startTime":97134,"duration":133},{"startTime":97417,"duration":67},{"startTime":98436,"duration":17},{"startTime":127899,"duration":51},{"startTime":128016,"duration":67},{"startTime":128351,"duration":16},{"startTime":128518,"duration":34},{"startTime":128618,"duration":303},{"startTime":129624,"duration":83},{"startTime":129791,"duration":50},{"startTime":129908,"duration":167},{"startTime":130141,"duration":101},{"startTime":130392,"duration":17},{"startTime":130609,"duration":469},{"startTime":131345,"duration":83},{"startTime":131446,"duration":83},{"startTime":131662,"duration":167},{"startTime":131846,"duration":184},{"startTime":132181,"duration":183},{"startTime":132548,"duration":67},{"startTime":132732,"duration":201},{"startTime":133384,"duration":16},{"startTime":133501,"duration":16},{"startTime":133652,"duration":149},{"startTime":133835,"duration":153},{"startTime":134155,"duration":133},{"startTime":134406,"duration":117},{"startTime":134623,"duration":100},{"startTime":134874,"duration":334},{"startTime":135375,"duration":135},{"startTime":135642,"duration":84},{"startTime":135809,"duration":134},{"startTime":136060,"duration":84},{"startTime":136294,"duration":101},{"startTime":136530,"duration":82},{"startTime":136779,"duration":318},{"startTime":137247,"duration":117},{"startTime":137499,"duration":99},{"startTime":137715,"duration":100},{"startTime":137915,"duration":118},{"startTime":138183,"duration":100},{"startTime":138417,"duration":101},{"startTime":138601,"duration":100},{"startTime":138868,"duration":320},{"startTime":139339,"duration":83},{"startTime":139539,"duration":100},{"startTime":139756,"duration":84},{"startTime":139957,"duration":100},{"startTime":140191,"duration":83},{"startTime":140408,"duration":84},{"startTime":140575,"duration":402},{"startTime":141110,"duration":117},{"startTime":141344,"duration":100},{"startTime":141578,"duration":89},{"startTime":141779,"duration":184},{"startTime":141979,"duration":117},{"startTime":142197,"duration":117},{"startTime":142414,"duration":150},{"startTime":149505,"duration":117},{"startTime":149689,"duration":367},{"startTime":150140,"duration":334},{"startTime":150591,"duration":101},{"startTime":154437,"duration":435},{"startTime":154922,"duration":135},{"startTime":155491,"duration":351},{"startTime":156075,"duration":670},{"startTime":157663,"duration":318},{"startTime":158164,"duration":101},{"startTime":158281,"duration":34},{"startTime":158382,"duration":334},{"startTime":158833,"duration":186},{"startTime":159036,"duration":117},{"startTime":159170,"duration":33},{"startTime":159270,"duration":351},{"startTime":159788,"duration":167},{"startTime":160289,"duration":101},{"startTime":160557,"duration":67},{"startTime":160775,"duration":250},{"startTime":161125,"duration":117},{"startTime":161393,"duration":83},{"startTime":161560,"duration":100},{"startTime":161827,"duration":134},{"startTime":162061,"duration":284},{"startTime":163014,"duration":117},{"startTime":163281,"duration":67},{"startTime":163448,"duration":151},{"startTime":163733,"duration":117},{"startTime":163966,"duration":104},{"startTime":164136,"duration":117},{"startTime":164570,"duration":134},{"startTime":164838,"duration":83},{"startTime":165022,"duration":83},{"startTime":165256,"duration":67},{"startTime":165490,"duration":67},{"startTime":165808,"duration":83},{"startTime":166058,"duration":51},{"startTime":166225,"duration":318},{"startTime":166694,"duration":133},{"startTime":166927,"duration":84},{"startTime":167162,"duration":83},{"startTime":167262,"duration":184},{"startTime":167463,"duration":233},{"startTime":167713,"duration":17},{"startTime":167781,"duration":133},{"startTime":168114,"duration":17},{"startTime":168314,"duration":17},{"startTime":198162,"duration":33},{"startTime":198295,"duration":402},{"startTime":199031,"duration":100},{"startTime":199267,"duration":67},{"startTime":199435,"duration":99},{"startTime":199635,"duration":134},{"startTime":199869,"duration":133},{"startTime":200036,"duration":184},{"startTime":200287,"duration":151},{"startTime":200504,"duration":117},{"startTime":200739,"duration":333},{"startTime":201206,"duration":101},{"startTime":201389,"duration":124},{"startTime":201590,"duration":518},{"startTime":202259,"duration":67},{"startTime":202460,"duration":66},{"startTime":202643,"duration":134},{"startTime":202994,"duration":17},{"startTime":203028,"duration":150},{"startTime":203479,"duration":100},{"startTime":203914,"duration":66},{"startTime":204014,"duration":33},{"startTime":204148,"duration":119},{"startTime":204368,"duration":116},{"startTime":204601,"duration":234},{"startTime":204986,"duration":16},{"startTime":205103,"duration":16},{"startTime":205253,"duration":83},{"startTime":205453,"duration":17},{"startTime":205739,"duration":32},{"startTime":205905,"duration":16},{"startTime":206022,"duration":17},{"startTime":206172,"duration":84},{"startTime":206357,"duration":65},{"startTime":206457,"duration":36},{"startTime":206624,"duration":16},{"startTime":207041,"duration":33},{"startTime":207292,"duration":50},{"startTime":207375,"duration":17},{"startTime":207493,"duration":18},{"startTime":207693,"duration":33},{"startTime":207794,"duration":33},{"startTime":207928,"duration":16},{"startTime":208044,"duration":33},{"startTime":208145,"duration":16},{"startTime":208278,"duration":100},{"startTime":208512,"duration":67},{"startTime":208612,"duration":34},{"startTime":208796,"duration":17},{"startTime":209014,"duration":16},{"startTime":209164,"duration":19},{"startTime":209250,"duration":16},{"startTime":209367,"duration":33},{"startTime":209467,"duration":40},{"startTime":209735,"duration":50},{"startTime":209852,"duration":16},{"startTime":210035,"duration":100},{"startTime":210236,"duration":117},{"startTime":210454,"duration":133},{"startTime":210670,"duration":352},{"startTime":211105,"duration":50},{"startTime":211205,"duration":17},{"startTime":211355,"duration":67},{"startTime":211640,"duration":16},{"startTime":211790,"duration":33},{"startTime":211907,"duration":34},{"startTime":212024,"duration":17},{"startTime":212141,"duration":17},{"startTime":212241,"duration":17},{"startTime":212358,"duration":51},{"startTime":212442,"duration":33},{"startTime":212609,"duration":418},{"startTime":213161,"duration":17},{"startTime":213294,"duration":84},{"startTime":213997,"duration":149},{"startTime":214282,"duration":17},{"startTime":214400,"duration":50},{"startTime":214483,"duration":67},{"startTime":214885,"duration":33},{"startTime":215001,"duration":50},{"startTime":215102,"duration":33},{"startTime":215235,"duration":34},{"startTime":215319,"duration":17},{"startTime":215603,"duration":17},{"startTime":215737,"duration":33},{"startTime":215854,"duration":117},{"startTime":216071,"duration":100},{"startTime":216309,"duration":97},{"startTime":216556,"duration":117},{"startTime":216907,"duration":33},{"startTime":217040,"duration":17},{"startTime":217158,"duration":116},{"startTime":217375,"duration":67},{"startTime":217459,"duration":217},{"startTime":217743,"duration":66},{"startTime":217876,"duration":51},{"startTime":218010,"duration":150},{"startTime":218227,"duration":151},{"startTime":218494,"duration":135},{"startTime":218779,"duration":50},{"startTime":218912,"duration":117},{"startTime":219146,"duration":34},{"startTime":219316,"duration":117},{"startTime":219650,"duration":34},{"startTime":219800,"duration":118},{"startTime":220018,"duration":167},{"startTime":220235,"duration":34},{"startTime":220368,"duration":302},{"startTime":220736,"duration":34},{"startTime":220870,"duration":50},{"startTime":220970,"duration":17},{"startTime":221104,"duration":50},{"startTime":221221,"duration":17},{"startTime":221422,"duration":384},{"startTime":221973,"duration":117},{"startTime":222174,"duration":133},{"startTime":222374,"duration":51},{"startTime":222491,"duration":84},{"startTime":222625,"duration":134},{"startTime":222893,"duration":67},{"startTime":223009,"duration":34},{"startTime":223160,"duration":133},{"startTime":223378,"duration":250},{"startTime":223695,"duration":16},{"startTime":223862,"duration":33},{"startTime":223945,"duration":50},{"startTime":224063,"duration":150},{"startTime":224315,"duration":167},{"startTime":224583,"duration":33},{"startTime":224767,"duration":184},{"startTime":225017,"duration":50},{"startTime":225920,"duration":184},{"startTime":226221,"duration":167},{"startTime":226405,"duration":183},{"startTime":226672,"duration":133},{"startTime":226939,"duration":117},{"startTime":227157,"duration":184},{"startTime":227374,"duration":16},{"startTime":227658,"duration":201},{"startTime":228427,"duration":17},{"startTime":228460,"duration":234},{"startTime":228895,"duration":167},{"startTime":229179,"duration":387},{"startTime":229699,"duration":151},{"startTime":229917,"duration":67},{"startTime":230068,"duration":183},{"startTime":230318,"duration":34},{"startTime":230435,"duration":351},{"startTime":230919,"duration":51},{"startTime":231036,"duration":34},{"startTime":231170,"duration":168},{"startTime":231722,"duration":16},{"startTime":231889,"duration":17},{"startTime":232022,"duration":84},{"startTime":232123,"duration":50},{"startTime":232256,"duration":135},{"startTime":232541,"duration":133},{"startTime":232775,"duration":183},{"startTime":233008,"duration":67},{"startTime":233159,"duration":167},{"startTime":233477,"duration":183},{"startTime":233694,"duration":33},{"startTime":233828,"duration":150},{"startTime":234045,"duration":84},{"startTime":234162,"duration":17},{"startTime":234314,"duration":67},{"startTime":234448,"duration":67},{"startTime":235869,"duration":33},{"startTime":236036,"duration":50},{"startTime":236170,"duration":67},{"startTime":236304,"duration":34},{"startTime":236437,"duration":51},{"startTime":236571,"duration":34},{"startTime":236705,"duration":50},{"startTime":236822,"duration":33},{"startTime":236973,"duration":149},{"startTime":237256,"duration":117},{"startTime":237525,"duration":49},{"startTime":237641,"duration":50},{"startTime":237758,"duration":50},{"startTime":237908,"duration":67},{"startTime":238042,"duration":33},{"startTime":238242,"duration":50},{"startTime":239381,"duration":100}]
      };

    })(),

    /**
     * The song data to be played in the Web Audio API
     */
    audio: new Sound('./audio/carolina.mp3', onload),
    // audio: (function() {

    //   // onload();

    //   return {
    //     play: function() {},
    //     pause: function() {},
    //     stop: function() {}
    //   };

    // })(),

    noConflict: function() {
      root.Carolina = previousCarolina;
      return Carolina;
    },

    /**
     * Internal Functions
     */

    _ready: false,

    __onEnded: _.identity,

    ready: function(f) {
      if (Carolina._ready) {
        f();
        return Carolina;
      }
      callbacks.push(f);
      return Carolina;
    },

    currentTime: 0,

    drag: 0.125,

    radialBreadth: radialBreadth,

    radialResolution: 1,

    palette: [
      colors.lobby,
      colors.firstVerse,
      colors.secondVerse,
      colors.thirdVerse,
      colors.chorus
    ],

    FOV: {
      min: 70,
      max: 140
    },

    propertyNames: propertyNames,

    /**
     * Setup drawing context.
     */
    init: function(callback) {

      var container = document.querySelector('#content');

      // Create the renderer and other initial objects
      Carolina.renderer = new THREE.WebGLRenderer({ antialias: true });
      Carolina.renderer.setPixelRatio(2);
      Carolina.scene = new THREE.Scene();

      Carolina.ground = new THREE.Object3D();
      Carolina.ground.position.y = - 10;

      Carolina.camera = new THREE.PerspectiveCamera(Carolina.FOV.min, window.innerWidth / window.innerHeight, 1, 1000);
      Carolina.camera._fov = Carolina.camera.fov;
      Carolina.camera.destFov = Carolina.FOV.min;
      Carolina.camera.zoom = 1;
      Carolina.camera.group = new THREE.Object3D();

      Carolina.camera.controls = new THREE.DeviceOrientationControls(Carolina.camera);
      Carolina.camera.velocity = Carolina.camera.destVelocity = Carolina.camera.far * 5 / 1000;
      Carolina.camera.cone = (function() {

        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 4, 32), new THREE.MeshBasicMaterial({
          color: 0x555555
        }));

        mesh.rotation.x = - Math.PI / 2;

        var group = new THREE.Object3D();
        group.add(mesh);

        // mesh.visible = false;

        return group;

      })();
      Carolina.camera.influence = new THREE.Euler().copy(Carolina.camera.cone.rotation);
      Carolina.camera.cone.position.set(0, Carolina.ground.position.y, - 20);

      Carolina.scene.fog = new THREE.Fog(0xffffff, Carolina.camera.far * 0.75, Carolina.camera.far);
      Carolina.renderer.setClearColor(0xffffff, 1);

      Carolina.path = new Path(Carolina.camera);

      Carolina.scene.add(Carolina.ground);
      Carolina.scene.add(Carolina.camera);
      Carolina.scene.add(Carolina.camera.group);
      Carolina.camera.add(Carolina.camera.cone);

      /**
       * Create initial `road` for clarity.
       */

      var distance = 22000; // Look up from experience
      var resolution = 256;
      var phi = Math.floor(Math.random() * 20) + 5 + 0.5;
      var radius = 25;

      var road = Carolina.road = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.SplineCurve3(_.map(_.range(resolution), function(i) {

            var pct = i / (resolution - 1);
            var taper = pct * pct * pct * pct * pct * pct * pct;
            var theta = pct * Math.PI * 2;

            var x = taper * 4 * radius * Math.sin(theta * phi);
            var y = 0;
            var z = (pct - 0.5) * (distance - Carolina.camera.far * 2);
            // taper * 4 * radius * Math.sin(theta * phi)

            return new THREE.Vector3(x, y, z);

        })), resolution, radius / 2, 3, false),

      // var road = Carolina.road = new THREE.Mesh(
      //   new THREE.PlaneGeometry(25, distance - Carolina.camera.far * 2, 5, 100),
        new THREE.MeshBasicMaterial({
          transparent: true,
          // opacity: 0.3,
          // wireframe: true,
          // color: 0x333333
          map: new THREE.Texture((function() {

            var two = new Two({
              type: Two.Types.canvas,
              width: 512,
              height: 512,
              ratio: 1
            });

            var clef = two.makeLine(two.width, 0, two.width, two.height);
            clef.linewidth = two.width / 64;
            clef.cap = 'round';
            clef.stroke = 'rgba(0, 0, 0, 0.5)';

            var measure = two.makeLine(two.width * 0.5, 0, two.width * 0.5, two.height);
            measure.stroke = 'rgba(0, 0, 0, 0.5)';

            var amt = 21;
            for (var i = 0; i < amt; i++) {
              var pct = i / (amt - 1);
              var y = pct * two.height;
              var l = two.makeLine(0, y, two.width, y);
              if (i <= 0) {
                l.translation.x += 1;
              } else if (i >= amt - 1) {
                l.translation.x -= 1;
              }
            }

            two.update();

            return two.renderer.domElement;

          })()),
          color: 0xffffff
        })
      );
      road.material.map.wrapS = road.material.map.wrapT = THREE.RepeatWrapping;
      road.material.map.repeat.set(72, 1);
      road.material.map.anisotropy = Carolina.renderer.getMaxAnisotropy() || 1;
      road.material.map.needsUpdate = true;
      road.distance = distance;

      Carolina.road.position.z = Carolina.road.distance / 2 + Carolina.camera.far;
      road.scale.y = 0.001;
      road.rotation.z = Math.PI;
      road.position.y = Carolina.ground.position.y - 5;
      Carolina.ground.add(road);

      /**
       * Create other perspectives
       */

      Carolina.cameras = [Carolina.camera];
      Carolina.cameras.current = Carolina.camera;

      var cam = createCamera(0, Carolina.camera.far * 0.66, 0);
      cam.rotation.z = Math.PI;

      createCamera(Carolina.camera.far * 0.66, 0, 0);
      createCamera(0, Carolina.camera.far * 0.5, - Carolina.camera.far * 0.5);
      Carolina.rotatingCamera = createCamera(0, 0, 0);
      Carolina.rotatingCamera.lookAt(new THREE.Vector3(0, 0, 1));
      createCamera(0, 0, 0);
      Carolina.rotatingCamera.lookAt(new THREE.Vector3(0, 0, 1));

      var px = window.innerWidth / 2;
      var py = window.innerHeight / 2;
      var pct = 0.5;
      var pcty = 0.5;
      var drag = function(e) {

        var dpct = ((e.clientX - px) / window.innerWidth) || 0;
        pct = Math.max(Math.min(pct + dpct, 1), 0);

        var dest = (1 - pct) * Carolina.radialBreadth - Carolina.radialBreadth / 2;
        Carolina.camera.cone.rotation.y += (dest - Carolina.camera.cone.rotation.y) * Carolina.drag;

        px = e.clientX;

        if (!url.boolean('yaxis')) {
          return;
        }

        dpct = ((e.clientY - py) / window.innerHeight) || 0;
        pcty = Math.max(Math.min(pcty + dpct, 1), 0);
        Carolina.camera.cone.rotation.x = (1 - pcty) * Math.PI / 4 - Math.PI / 8;

        py = e.clientY;

      };

      var speedUp = function(e) {
        Carolina.camera.destVelocity = Carolina.camera.far * 10 / 1000;;
        px = e.clientX;
        py = e.clientY;
      };
      var slowDown = function(e) {
        Carolina.camera.destVelocity = Carolina.camera.far * 5 / 1000;;
      };
      var _scale;
      var zoomstart = function(e) {
        _scale = e.scale;
      };
      var zoom = function(e) {
        var delta = e.scale - _scale;
        Carolina.camera.zoom += delta;
        Carolina.camera.zoom = Math.max(Math.min(Carolina.camera.zoom, 5), 0.5);
        _scale = e.scale;
      };

      var hammer = new Hammer.Manager(document.querySelector('#content'));
      hammer.add([new Hammer.Pinch(), new Hammer.Tap()]);

      hammer
        .on('pinchstart', zoomstart)
        .on('pinch', zoom);

      window.addEventListener('click', Carolina.changeCameraAngle, false);
      window.addEventListener('resize', Carolina.resize, false);
      Carolina.resize();

      Carolina.renderer.render(Carolina.scene, Carolina.cameras.current);
      container.appendChild(Carolina.renderer.domElement);

      for (var type in Carolina.triggers) {
        var data = Carolina.triggers[type];
        data.index = 0;
        Carolina.register(type, Math.max(Math.floor(data.length / 10), 1));
      }

      onload();

      Carolina.ready(callback);

      return Carolina;

    },

    playing: false,

    play: function(options) {

      if (Carolina.playing) {
        return Carolina;
      }

      lastFrame = TWEEN.clock.now();

      Carolina.playing = true;
      Carolina.audio.play(options);

      // Carolina.loop();
      Carolina.currentTime = options && _.isNumber(options.elapsed) ? options.elapsed : Carolina.currentTime;

      return Carolina;

    },

    pause: function() {

      Carolina.playing = false;
      Carolina.audio.pause();

      return Carolina;

    },

    stop: function() {

      Carolina.currentTime = 0;
      pacing.index = 0;
      bendInfluence.index = 0;
      feelingIt.index = 0;
      finalStrike.index = 0;
      Carolina.playing = false;
      Carolina.road.position.z = Carolina.camera.position.z + Carolina.road.distance / 2 + Carolina.camera.far;
      Carolina.road.rotation.y = Math.random() > 0.5 ? 0 : Math.PI;

      Carolina.audio.stop();

      _.each(Carolina.triggers, function(trigger) {
        trigger.index = 0;
      });

      TWEEN.removeAll();
      Carolina.resetCameraAngle();

      return Carolina;

    },

    loop: function() {

      if (!Carolina.playing) {
        return;
      }

      var timeDelta, now = TWEEN.clock.now();

      if (!!lastFrame) {
        timeDelta = parseFloat((now - lastFrame).toFixed(3));
      }
      lastFrame = now;

      if (Carolina.playing && timeDelta) {
        Carolina.currentTime += timeDelta / 1000;
      }

      var minDuration = Math.floor(timeDelta * (Carolina.camera.far / Carolina.camera.velocity));
      var currentMillis = Carolina.currentTime * 1000;
      var bufferMillis = minDuration * 0.5;

      TWEEN.update(currentMillis);

      // Carolina.camera.influence._x += Carolina.camera.cone.rotation._x / Carolina.radialResolution;
      // Carolina.camera.influence._y += Carolina.camera.cone.rotation._y / Carolina.radialResolution;
      // Carolina.camera.influence._z += Carolina.camera.cone.rotation._z / Carolina.radialResolution;

      if (currentMillis > 24636) {
        Carolina.camera.controls.update();
      }
      Carolina.path.update();

      nullObject.position.copy(Carolina.path.points[1]);
      nullObject.lookAt(Carolina.path.points[0]);

      vector.copy(Carolina.path.getPoint(0.1));

      for (var k in Carolina.triggers) {

        var list = Carolina.triggers[k];

        if (list.index >= list.length) {
          continue;
        }

        var t = list[list.index];

        if (t.startTime <= currentMillis + bufferMillis) {
          var o = Carolina.objects[k].active;
          o.duration = minDuration * 2;
          o.t = t.duration / 1000;
          o.start(vector, nullObject.rotation);
          list.index++;
        }

      }

      if (pacing.index < pacing.length && pacing[pacing.index].startTime <= currentMillis) {
        Carolina.setColors(Carolina.palette[pacing[pacing.index].palette]);
        pacing.index++;
      }

      if (feelingIt.index < feelingIt.length && feelingIt[feelingIt.index].startTime <= currentMillis) {
        // Carolina.camera.fov = 1;
        Carolina.camera.destFov = Carolina.camera.destFov === Carolina.FOV.min ? Carolina.FOV.max : Carolina.FOV.min;
        // TODO: Figure out new setting between 70 and 140
        feelingIt.index++;
      }

      // if (bendInfluence.index < bendInfluence.length && bendInfluence[bendInfluence.index].startTime <= currentMillis) {
      //   Carolina.camera.influence._y += bendInfluence[bendInfluence.index].rotation / Carolina.radialResolution;
      //   bendInfluence.index++;
      // }

      if (finalStrike.index < finalStrike.length && finalStrike[finalStrike.index].startTime <= currentMillis) {
        Carolina.__onEnded();
        finalStrike.index++;
      }

      if (Carolina.cameras.current === Carolina.camera) {
        Carolina.camera._fov += (Carolina.camera.destFov - Carolina.camera._fov) * 0.0625;
        Carolina.camera.fov = Carolina.camera._fov / Carolina.camera.zoom;
      } else {
        Carolina.cameras.current.fov = Carolina.FOV.min / Carolina.camera.zoom;
      }
      Carolina.cameras.current.updateProjectionMatrix();
      Carolina.camera.velocity += (Carolina.camera.destVelocity - Carolina.camera.velocity) * 0.33;
      Carolina.camera.group.position.copy(Carolina.camera.position);
      Carolina.rotatingCamera.rotation.z = now / (60 * Math.PI * 2);

      Carolina.renderer.render(Carolina.scene, Carolina.cameras.current);

      return Carolina;

    },

    resize: function() {

      var width = window.innerWidth;
      var height = window.innerHeight;

      Carolina.renderer.setSize(width, height);
      var aspect = width / height;

      for (var i = 0; i < Carolina.cameras.length; i++) {
        var camera = Carolina.cameras[i];
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      if (!Carolina.playing) {
        Carolina.renderer.render(Carolina.scene, Carolina.cameras.current);
      }

      return Carolina;

    },

    changeCameraAngle: function() {

      if (!Carolina.playing) {
        return false;
      }

      Carolina.cameras.index = (Carolina.cameras.index + 1) % Carolina.cameras.length;
      Carolina.cameras.current = Carolina.cameras[Carolina.cameras.index];

      return Carolina;

    },

    resetCameraAngle: function() {

      Carolina.cameras.index = 0;
      Carolina.cameras.current = Carolina.cameras[Carolina.cameras.index];

      return Carolina;

    },

    /**
     * The active scene.
     */
    active: null,

    camera: null,

    /**
     * Scene construction
     */

    objects: {},

    instances: [],

    structs: {

      'prog': Prog,
      'kick': Kick,
      'perc': Perc,
      'timpani': Timpani,
      'bass': Bass,
      'hook': Hook,
      'guitar': Guitar,
      'mellotron': Mellotron,
      'vanguard': Vanguard

    },

    register: function(name, size) {

      console.log('There will be', size, name);

      var struct = Carolina.structs[name];

      // switch (struct.type) {
      //   case '2d':
      //     struct.setInstance(Carolina.two);
      //     break;
      // }

      var list = _.map(_.range(size), function(i) {
        var obj = new Carolina.structs[name]();
        switch (struct.type) {
          // case '2d':
          //   break;
          default:
            Carolina.ground.add(obj);
        }
        return obj;
      });

      this.objects[name] = new Pool(list);
      this.instances = this.instances.concat(list);

      return Carolina;

    },

    reset: function(options) {
      Carolina.stop().play(options);
      return Carolina;
    },

    setColors: function(palette) {

      for (var k in Carolina.structs) {
        var struct = Carolina.structs[k];
        var color = palette[struct.distinction % palette.length];
        struct.setColor(color);
      }

      Carolina.setBackground(palette[0]);

      // if (Carolina.scene.fog) {
      //   Carolina.scene.fog.color.copy(palette[0]);
      // }
      // Carolina.renderer.setClearColor(palette[0], 1);

      return Carolina;

    },

    setPalette: function(palette) {

      for (var k in Carolina.structs) {
        var struct = Carolina.structs[k];
        var color = palette[struct.distinction % palette.length];
        struct.changeColor(color);
      }

      Carolina.setBackground(palette[0]);

      return Carolina;

    },

    colorDuration: 1000,

    setBackground: (function() {

      var color = new THREE.Color();
      var tween = new TWEEN.Tween(color)
        .onUpdate(function() {

          if (Carolina.scene.fog) {
            Carolina.scene.fog.color.copy(color);
          }
          Carolina.renderer.setClearColor(color, 1);
          document.body.style.background = 'rgb('
            + Math.floor(color.r * 255) + ','
            + Math.floor(color.g * 255) + ','
            + Math.floor(color.b * 255) + ')';

        })
        .onComplete(function() {
          tween.stop();
        });

      return function(c, duration) {
        tween.to(c, duration || Carolina.colorDuration)
        tween.start();
      };

    })()

  };

  var silenceAudio = _.debounce(function() {
    Carolina.audio.volume = 0;
  }, 150);

  loop();

  function loop() {

    requestAnimationFrame(loop);
    Carolina.loop();

    if (!Carolina.playing) {
      return;
    }

    /**
     * Made for silencing audio when app is not in focus.
     */
    if (Carolina.audio.volume < 1) {
      Carolina.audio.volume = 1;
    } else {
      silenceAudio();
    }

  }

  function createCamera(x, y, z) {

    var camera = new THREE.PerspectiveCamera(Carolina.FOV.min);
    camera.position.set(x || 0, y || 0, z || 0);
    camera.lookAt(ZERO);

    Carolina.camera.group.add(camera);
    Carolina.cameras.push(camera);

    return camera;

  }

})();
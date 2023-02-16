
//////////////////////////////////////////////////////////////
// MAIN 
// initialisation des variables
init_variable()
// initialisation du canvas : load des images 
init()
// action
animate()
//////////////////////////////////////////////////////////////
function init_variable(){
  // Fleche
  scale_fleche = 0.12
  dy = 20

  // Boutons
  scale_bouton = 0.7
  
  // SOURIS
  // gestion de la souris : pour savoir si on a clické et sur quelle image on a clické
  clicked = false
  which_clicked = -1

  // TEMPS
  // pour avoir un délai après le click
  time_click = new Date().getTime()

  // Couleur
  alpha_survol = 0.3

  // DATA github
  indice_mesh = 0
  mesh_courant = "nope"
  // Indices angles
  idx_i = 0
  idx_j = 2 // Fleche H et B : 0 --> pi/2; 1 --> pi/4; 2 --> 0(en face); 3 --> -pi/4; 4 --> -pi/2
  // dictionnaire avec les choix poru TOUS les mesh
  choix = {}
  // Choix des N poses demandé pour les mesh courant
  choix_courant = {}
  // Angles des poses choisies pour le mesh courant
  liste_poses = []
  // Nb courant de pose choisies
  nb_choix_fait = 0
  // nombre de pose qu'on demande de choisir
  nb_choix_demande = 3


  // Fenetre 3D
  W_3D = window.innerWidth*0.65
  H_3D = window.innerHeight*0.65
  // Rayon 
  R = 2.5
}

function init(){

  // document.addEventListener("keydown", function(event) {
  //   if (event.code == 37) {
  //     console.log("deplacement K-G")
  //     idx_i = (idx_i+1)%8

  //   } else if (event.code == 39) {
  //     console.log("deplacement K-D")
  //     idx_i = (idx_i+7)%8

  //   } else if (event.code == 40) {
  //     console.log("deplacement K-B")
  //     idx_j = Math.min(idx_j+1,4) 

  //   } else if (event.code == 38) {
  //     console.log("deplacement K-H")  
  //     idx_j = Math.max(idx_j-1,0)
  
  //   }
  //   theta = 2*Math.PI * ( (2/8)*(idx_j==0) + (1/8)*(idx_j==1) + (-1/8)*(idx_j==3) + (-2/8)*(idx_j==4)); delta = 2*Math.PI * (idx_i/8)
  //   console.log("angles: ",theta, delta)

  // })

  document.addEventListener("keydown", function(event) {
    switch (event.key){
      case  'ArrowLeft': 
        console.log("deplacement K-G")
        idx_i = (idx_i+1)%8
        break;
      case 'ArrowRight' :
        console.log("deplacement K-D")
        idx_i = (idx_i+7)%8
        break;
      case 'ArrowDown' :
        console.log("deplacement K-B")
        idx_j = Math.min(idx_j+1,4) 
        break;
      case 'ArrowUp' :
        console.log("deplacement K-H")  
        idx_j = Math.max(idx_j-1,0)
        break;
      case 'Enter' :
        console.log('bouton ajout pose')
        liste_poses.push(['choix'+(nb_choix_fait+1),theta, delta, idx_i, idx_j]) 
        nb_choix_fait = nb_choix_fait+1
        break;
      case 'Backspace':
        console.log('bouton retirer')
        // il y a des poses à retirer
        if (liste_poses.length > 0){liste_poses.pop()} 
        // S'il n'y a pas de pose choisie
        else {console.log("Il n'y a pas de pose à retirer.")}
        break;

    }

    //theta = 2*Math.PI * ( (2/8)*(idx_j==0) + (1/8)*(idx_j==1) + (-1/8)*(idx_j==3) + (-2/8)*(idx_j==4)); delta = 2*Math.PI * (idx_i/8)
    //console.log("angles: ",theta, delta)
  })

  canvas = document.getElementById("canvas")
  ctx = canvas.getContext("2d")  
  // Caméra 
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.x = 2;
  camera.position.y = 0;
  camera.position.z = 0;
  //camera.lookAt (new THREE.Vector3(0,0,0))
  scene = new THREE.Scene();
  scene.add(camera)
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(W_3D , H_3D);
  document.body.appendChild( renderer.domElement );
  controls = new THREE.OrbitControls( camera );
  controls.enableZoom = false;
  controls.keys = {}
  controls.mouseButtons = {}
  controls.update();

  // Light
  const light_gauche = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light_gauche );
  const color = 0xFFFFFF;
  const intensity = 0.6;
  const dirlight_gauche = new THREE.DirectionalLight(color, intensity);
  dirlight_gauche.position.set(-1, 2, 4);
  scene.add(dirlight_gauche);

  const light_droite = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add(light_droite);
  const dirlight_droite = new THREE.DirectionalLight(color, intensity);
  dirlight_droite.position.set(-1, 2, -4);
  scene.add(dirlight_droite);

  const light_dessous = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add(light_dessous);
  const intensity_dessous = 0.3;
  const dirlight_dessous = new THREE.DirectionalLight(color, intensity_dessous);
  dirlight_dessous.position.set(-1, -2, 0);
  scene.add(dirlight_dessous);

  // Data 2D
  imgs = {}
  imgs["droite"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Fleches/fleche_droite.png')//new_image("graphics/fleche_droite.png")
  imgs["gauche"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Fleches/fleche_gauche.png') //new_image("graphics/fleche_gauche.png")
  imgs["bas"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Fleches/fleche_bas.png') //new_image("graphics/fleche_bas.png")
  imgs["haut"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Fleches/fleche_haut.png') //new_image("graphics/fleche_haut.png")
  imgs["tmp"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Autres/tmp.jpg')
  // /// Boutons 
  boutons = {}
  boutons["reinitialiser"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Boutons/bouton_reinitialiser.png')
  boutons["valider"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Boutons/bouton_valider.png')
  boutons["choix_pose"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Boutons/bouton_pose.png')
  boutons["retirer"] = new_image('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/Boutons/bouton_retirer.png')

  // Data 3D
  obj_file = ['dragon_update_user_study.obj', 'camel_update_user_study_normed.obj', 'gorgoile_update_user_study_centered_normed.obj']
  const objLoader = new THREE.OBJLoader2();
  objLoader.load('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/3DMesh/'+obj_file[indice_mesh], (event) => {
      const root = event.detail.loaderRootNode;
      scene.add(root);
      });
  mesh_courant = obj_file[indice_mesh].split('_')[0]
  choix_courant['obj_file'] = obj_file[indice_mesh]
  choix_courant['mesh'] = mesh_courant

  // Mouse
  xyMouseMove = {"x": -1, "y": -1}
  xyMouseDown = {"x": -1, "y": -1}
  xyMouseUp = {"x": -1, "y": -1}

  canvas.addEventListener("mousemove", function(event) { xyMouseMove = getMousePos(canvas, event)}, false)
  canvas.addEventListener("mousedown", function(event) { 
      xyMouseDown = getMousePos(canvas, event)
      clicked = true }, false)
  canvas.addEventListener("mouseup", function(event) { xyMouseUp = getMousePos(canvas, event)}, false)

  console.log("fin init")
}


function animate() {  
  // Nettoyage fleche
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // Affichage fleche
  afficher_fleche(imgs, dy, scale_fleche)
  // affichage de sboutons
  afficher_bouton(boutons, imgs, scale_bouton, scale_fleche)
  // traitement fleche (surval + click)
  traitement_fleche(imgs)
  // traitement bouton
  traitement_bouton(boutons)
  // affichage 3D
  renderer.render( scene, camera );
  // Boucle sur animate
  requestAnimationFrame( animate );
  // clicked 
  clicked = false
  which_clicked = -1

  ctx.strokeStyle = "rgb(255, 255, 255)" // Pour que le contour soit rouge
  ctx.fillStyle = "rgb(255, 255, 255)" // Pour que l'intérieur soit bleu
  ctx.font = "bold 22pt Courier";
  ctx.fillText(liste_poses.length, W_3D+10, 100)

  

}


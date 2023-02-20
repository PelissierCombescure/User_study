
//////////////////////////////////////////////////////////////
// MAIN 
// initialisation des variables
init_variable()
// initialisation du canvas : load des images 
setUp_3D(indice_mesh)
init()
// action
animate()

//////////////////////////////////////////////////////////////
function init_variable(){
   // SOURIS
  // gestion de la souris : pour savoir si on a clické et sur quelle image on a clické
  clicked = false
  which_clicked_bouton = -1
  which_clicked_fleche = -1

  // TEMPS
  // pour avoir un délai après le click
  time_click = new Date().getTime()

  // Couleur
  alpha_survol = 0.3

  // DATA github
  indice_mesh = 0
  mesh_courant = "nope"
  nb_mesh = 3
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
  // Numero de la tache courant --> il y en a autant que de mesh à voir
  num_tache = 1


  // Fenetre 3D
  W_3D = window.innerWidth*0.65
  H_3D = window.innerHeight*0.65

}

function setUp_3D(idx_mesh){
  idx_i = Math.floor(Math.random()*8)
  idx_j = Math.floor(Math.random()*5)

  cc = document.getElementById("renderer")

  canvas = document.getElementById("canvas")
  ctx = canvas.getContext("2d")  

  canvasMin = document.getElementById("canvasMiniatures")
  ctxMin = canvasMin.getContext("2d")  

  // Caméra 
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.x = 2;
  camera.position.y = 0;
  camera.position.z = 0;
  //camera.lookAt (new THREE.Vector3(0,0,0))
  scene = new THREE.Scene();
  scene.add(camera)
  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    preserveDrawingBuffer: true } );

  renderer.setSize(W_3D , H_3D);
  old_renderer = document.getElementById('renderer')
  if (old_renderer!=  null){
    old_renderer.parentElement.removeChild(old_renderer)
  }
  renderer.domElement.id = 'renderer'
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

  // Data 3D
  obj_file = ['dragon_update_user_study.obj', 'camel_update_user_study_normed.obj', 'gorgoile_update_user_study_centered_normed.obj']
  const objLoader = new THREE.OBJLoader2();
  objLoader.load('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/3DMesh/'+obj_file[idx_mesh], (event) => {
      const root = event.detail.loaderRootNode;
      scene.add(root);
      });
  mesh_courant = obj_file[idx_mesh].split('_')[0]
  choix_courant['obj_file'] = obj_file[idx_mesh]
  choix_courant['mesh'] = mesh_courant
}

function init(){
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
      // valider pose
      case ' ' :
        // on regarde si la pose sélectionnée n'a pas déjà été choisie avant
        pose_deja_choisie(liste_poses, idx_i, idx_j)
        if (deja_choisie){console.log("Cette pose a déjà été sélectionnée.")}
        // si on a pas encore choisie toutes nos poses, on peut en ajouter
        if (nb_choix_fait < nb_choix_demande && !(deja_choisie)){
            liste_poses.push(['choix'+(nb_choix_fait+1),theta, delta, idx_i, idx_j, new Date().getTime() - time_click]) 
            time_click = new Date().getTime()
            nb_choix_fait = nb_choix_fait+1 }
        // plus de choix possible
        if (nb_choix_fait == nb_choix_demande) {console.log("Tu as déjà fait tes "+nb_choix_demande+" choix.")}
        break;
      // retirer
      case 'Backspace':
        console.log('bouton retirer')
        // il y a des poses à retirer
        if (liste_poses.length > 0){
          liste_poses.pop()
          nb_choix_fait = nb_choix_fait-1} 
        // S'il n'y a pas de pose choisie
        else {console.log("Il n'y a pas de pose à retirer.")}
        break;
      // reintialiser
      case 'Delete':
        console.log('bouton retirer')
        // on reprends au début
        time_click = new Date().getTime()
        liste_poses = []
        nb_choix_fait = 0
        break;
      // valider
      case  'Enter':
        console.log('bouton valider')
        if (nb_choix_demande == liste_poses.length){
            console.log('au suivant')
            choix_courant['choix_poses'] = liste_poses
            choix['tache_N'+num_tache] = choix_courant
            // RAZ
            choix_courant = {}
            liste_poses = []
            nb_choix_fait = 0
            // Mesh suivant 
            indice_mesh = indice_mesh + 1
            num_tache = num_tache+1
            setUp_3D(indice_mesh)
        }
        else{
            console.log("Tu n'as pas fait tes 3 choix")
        }
        break;

    }
    //theta = 2*Math.PI * ( (2/8)*(idx_j==0) + (1/8)*(idx_j==1) + (-1/8)*(idx_j==3) + (-2/8)*(idx_j==4)); delta = 2*Math.PI * (idx_i/8)
    //console.log("angles: ",theta, delta)
  })

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
  if (num_tache <= nb_mesh){
    // Variable pour les fonctions
    init_variable_fonction(boutons, imgs)
    // Nettoyage fleche
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // progress bar
    progress_bar(num_tache, nb_mesh)
    // Affichage fleche
    afficher_fleche(imgs)
    // affichage de sboutons
    afficher_bouton(boutons)
    if (cc === null) {
      cc = document.getElementById("renderer")
    }  
    // traitement fleche (surval + click)
    traitement_fleche()
    // traitement bouton
    traitement_bouton()
    // afficher + maj du recap de pose choisie : affichage des vue des poses
    afficher_recap(imgs)
    // affichage 3D
    renderer.render( scene, camera );
    // Boucle sur animate
    requestAnimationFrame( animate );

    // Les poses choisies sont grisées
    bloquer_pose(liste_poses)

    // Texte
    ctx.strokeStyle = "rgb(255, 255, 255)" // Pour que le contour soit rouge
    ctx.fillStyle = "rgb(255, 255, 255)" // Pour que l'intérieur soit bleu
    ctx.font = "bold 18pt Courier";
    ctx.fillText("Nb choix fait : "+liste_poses.length+","+nb_choix_fait, W_3D-300, H_3D)

    // RAZ 
    clicked = false
    which_clicked_fleche = -1
    which_clicked_bouton = -1
  }
  else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    console.log('fini !!!')
    draw_rectangle(0,0,canvas.width, canvas.height, "rgb(34,34,34)", 1)
    ctx.strokeStyle = "rgb(255, 255, 255)" // Pour que le contour soit rouge
    ctx.fillStyle = "rgb(255, 255, 255)" // Pour que l'intérieur soit bleu
    ctx.font = "bold 58pt Courier";
    ctx.fillText("FIN", W_3D-300, H_3D-100)
  }

  

}


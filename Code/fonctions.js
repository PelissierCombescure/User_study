// Variable global
// bouton
function init_variable_fonction(dict_boutons, dict_imgs ){
    // bouton
    scale_bouton = 0.7
    h_bouton = scale_bouton*dict_boutons["choix_pose"].height
    w_bouton = scale_bouton*dict_boutons["choix_pose"].width
    // fleche 
    scale_fleche = 0.12
    dy = 20
    a = scale_fleche*dict_imgs["gauche"].height
    b = scale_fleche*dict_imgs["gauche"].width
    // Couleur 
    alpha_bloque = 0.6
    // Rayon 
    R = 2.5
    // progress bar
    x_progress_bar = W_3D
    y_progress_bar = 0
    w_progress_bar = 100
    h_progress_bar = 20
}


function new_image(src) {
    img = new Image()
    img.src = src
    return img
  }

function getMousePos(c, event) {
    var rect = c.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}


function draw_rectangle(originex, originey, largeur, hauteur, couleur, alpha){
    ctx.beginPath()
    ctx.moveTo(originex, originey)
    ctx.lineTo(originex+largeur, originey)
    ctx.lineTo(originex+largeur, originey+hauteur)
    ctx.lineTo(originex, originey+hauteur)
    ctx.lineTo(originex, originey)
    ctx.fillStyle = couleur
    ctx.globalAlpha = alpha
    ctx.fill()
    ctx.globalAlpha = 1 
}

function draw_contour(originex, originey, largeur, hauteur, couleur){
    ctx.beginPath()
    ctx.moveTo(originex, originey)
    ctx.lineTo(originex+largeur, originey)
    ctx.lineTo(originex+largeur, originey+hauteur)
    ctx.lineTo(originex, originey+hauteur)
    ctx.lineTo(originex, originey)
    ctx.lineWidth = 5
    ctx.strokeStyle = couleur
    ctx.stroke()
    ctx.lineWidth = 1
}

function bloquer_pose(L_poses){
    for (p=0; p<L_poses.length; p++){
        idx_i_p = L_poses[p][3]
        idx_j_p = L_poses[p][4]
        // Si on est en train de voir une pose déjà choisie
        if (idx_i== idx_i_p && idx_j==idx_j_p){
            draw_rectangle(0,0, W_3D, H_3D, "rgb(0, 0, 0)", alpha_bloque)
            ctx.font = "bold 18pt Courier";
            ctx.strokeStyle = "rgb(255, 255, 255)" // Pour que le contour soit rouge
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillText("Pose déjà sélectionnée", 10, H_3D)
        }
    }
}

function progress_bar(N_tache, N_mesh){
    if (N_tache<=N_mesh){
        // background
        draw_rectangle(x_progress_bar, y_progress_bar, w_progress_bar, h_progress_bar, "rgb(255,255,255)", 1)
        // bar 
        w_bar = ((N_tache-1)/N_mesh)*w_progress_bar
        draw_rectangle(x_progress_bar, y_progress_bar, w_bar, h_progress_bar, "rgb(0,0,255)", 1)
        // numero de tache 
        ctx.strokeStyle = "rgb(255, 255, 255)" // Pour que le contour soit rouge
        ctx.fillStyle = "rgb(255, 255, 255)" // Pour que l'intérieur soit bleu
        ctx.font = "bold 18pt Courier";
        ctx.fillText((num_tache)+"/"+(N_mesh), x_progress_bar+w_progress_bar+10, h_progress_bar)
    }
}

function pose_deja_choisie(L_poses, i_choix, j_choix){
    deja_choisie = false
    for (p=0; p<L_poses.length; p++){
        idx_i_p = L_poses[p][3]
        idx_j_p = L_poses[p][4]
        // Si on est en train de voir une pose déjà choisie
        if (i_choix == idx_i_p && j_choix==idx_j_p){
            deja_choisie = true
        }
    }
}


///////////////////////////////////////////////////////////////
///////////////////// FLECHE 

function afficher_fleche(dict_imgs){
    // image, posx, posy, W, H
    ctx.drawImage(dict_imgs["bas"], W_3D*0.35, H_3D+dy+b+a, a, b)
    ctx.drawImage(dict_imgs["haut"], W_3D*0.35, H_3D+dy, a, b)
    ctx.drawImage(dict_imgs["gauche"], W_3D*0.35-b, H_3D+dy+b, b, a)
    ctx.drawImage(dict_imgs["droite"], W_3D*0.35+a, H_3D+dy+b, b, a)

}

// afficher un rectangle autour des fleches quand la souris survol
function survol_fleche(){
    // Fleche GAUCHE
    if (xyMouseMove.x >= W_3D*0.35-b  && xyMouseMove.x <= W_3D*0.35 && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        draw_rectangle(W_3D*0.35-b, H_3D+dy+b, b, a, "rgb(0, 255, 0)", alpha_survol)
    }
    // Fleche DROITE
    if (xyMouseMove.x >= W_3D*0.35+a  && xyMouseMove.x <= W_3D*0.35+a+b && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        draw_rectangle(W_3D*0.35+a, H_3D+dy+b, b, a, "rgb(0, 255, 255)", alpha_survol)
    }
    // Fleche HAUT
    if (xyMouseMove.x >= W_3D*0.35  && xyMouseMove.x <= W_3D*0.35+a && xyMouseMove.y > H_3D+dy && xyMouseMove.y < H_3D+dy+b ){
    // l'image devient verte 
        draw_rectangle(W_3D*0.35, H_3D+dy, a, b, "rgb(0, 0, 255)", alpha_survol)
    }
    // Fleche BAS
    if (xyMouseMove.x >=  W_3D*0.35  && xyMouseMove.x <=  W_3D*0.35+a && xyMouseMove.y > H_3D+dy+b+a && xyMouseMove.y < H_3D+dy+b+a+b ){
        // l'image devient verte 
        draw_rectangle(W_3D*0.35, H_3D+dy+b+a, a, b, "rgb(255, 0, 255)", alpha_survol)
    }
}

// MAJ de which_clicked avec le nom de la fleche clickée
function get_clicked_fleche(){
    // Fleche GAUCHE
    if (clicked && xyMouseMove.x >= W_3D*0.35-b  && xyMouseMove.x <= W_3D*0.35 && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        which_clicked_fleche = 'gauche'
    }
    // Fleche DROITE
    if (clicked && xyMouseMove.x >= W_3D*0.35+a  && xyMouseMove.x <= W_3D*0.35+a+b && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        which_clicked_fleche = 'droite'
    }
    // Fleche HAUT
    if (clicked && xyMouseMove.x >= W_3D*0.35  && xyMouseMove.x <= W_3D*0.35+a && xyMouseMove.y > H_3D+dy && xyMouseMove.y < H_3D+dy+b ){
    // l'image devient verte 
        which_clicked_fleche = 'haut'
    }
    // Fleche BAS
    if (clicked && xyMouseMove.x >=  W_3D*0.35  && xyMouseMove.x <=  W_3D*0.35+a && xyMouseMove.y > H_3D+dy+b+a && xyMouseMove.y < H_3D+dy+b+a+b ){
        // l'image devient verte 
        which_clicked_fleche = 'bas'
    }
}

function traitement_fleche(){
    // Survol des fleches avec la souris
    survol_fleche()
    // click sur une fleche
    get_clicked_fleche()
    //console.log(which_clicked_fleche)
    switch (which_clicked_fleche){
        case'gauche' :
            console.log("deplacement G")
            idx_i = (idx_i+1)%8
            break;
        case 'droite' :
            console.log("deplacement D")
            idx_i = (idx_i+7)%8 
            break;
        case'haut' :
            console.log("deplacement H")  
            idx_j = Math.max(idx_j-1,0)
            //idx_j = Math.max(idx_j-1,1)
            break;
        case 'bas' :
            console.log("deplacement B")
            idx_j = Math.min(idx_j+1,4)  
            //idx_j = Math.min(idx_j+1,3) 
            break;
        }
     
    //R = 2.5
    theta = 2*Math.PI * ( (2/8)*(idx_j==0) + (1/8)*(idx_j==1) + (-1/8)*(idx_j==3) + (-2/8)*(idx_j==4))
    delta = 2*Math.PI * (idx_i/8)
    //console.log(theta, delta)
    //camera.position.set(R*Math.cos(theta)*Math.cos(delta), R*Math.sin(theta)*Math.cos(delta), R*Math.sin(delta)) // repère wiki
    camera.position.set(R*Math.cos(delta)*Math.cos(theta), R*Math.sin(theta), R*Math.sin(delta)*Math.cos(theta)) // repère JS
    camera.lookAt(0, 0, 0)  


    if (clicked){
        //console.log("affichage angles: ",theta, delta)
    }

}

///////////////////////////////////////////////////////////////
///////////////////// BOUTON
function afficher_bouton(dict_boutons){
    ecart = 40 // entre les fleches et le bouton
    // image, posx, posy, W, H
    ctx.drawImage(dict_boutons["choix_pose"], W_3D*0.35+a+2*b+ecart, H_3D+dy+b, w_bouton, h_bouton)
    ctx.drawImage(dict_boutons["retirer"], W_3D*0.35+a+2*b+ecart*7, H_3D+dy+b, w_bouton, h_bouton)
    ctx.drawImage(dict_boutons["reinitialiser"], W_3D*0.35+a+2*b+ecart*7, H_3D+dy+b+ecart*2, w_bouton, h_bouton)
    ctx.drawImage(dict_boutons["valider"], W_3D*0.35+a+2*b+ecart, H_3D+dy+b+ecart*2, w_bouton, h_bouton)
}

function survol_bouton(){
    // Choisir le pt de vue
    if (xyMouseMove.x >= W_3D*0.35+a+2*b+ecart  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        draw_contour(W_3D*0.35+a+2*b+ecart, H_3D+dy+b, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
    // Retirer 
    if (xyMouseMove.x >= W_3D*0.35+a+2*b+ecart*7  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart*7+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        draw_contour(W_3D*0.35+a+2*b+ecart*7, H_3D+dy+b, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
    // Reintialiser
    if (xyMouseMove.x >= W_3D*0.35+a+2*b+ecart*7  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart*7+w_bouton && xyMouseMove.y > H_3D+dy+b+ecart*2 && xyMouseMove.y < H_3D+dy+b+ecart*2+h_bouton ){
        draw_contour(W_3D*0.35+a+2*b+ecart*7, H_3D+dy+b+ecart*2, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
    // Valider
    if (xyMouseMove.x >= W_3D*0.35+a+2*b+ecart  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b+ecart*2 && xyMouseMove.y < H_3D+dy+b+ecart*2+h_bouton ){
        draw_contour(W_3D*0.35+a+2*b+ecart, H_3D+dy+b+ecart*2, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
}

function get_clicked_bouton(){
    if (clicked && xyMouseMove.x >= W_3D*0.35+a+2*b+ecart  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        which_clicked_bouton = "bouton_pose"
    }
    if (clicked && xyMouseMove.x >= W_3D*0.35+a+2*b+ecart*7  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart*7+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        which_clicked_bouton = "bouton_retirer"
    }
    if (clicked && xyMouseMove.x >= W_3D*0.35+a+2*b+ecart*7  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart*7+w_bouton && xyMouseMove.y > H_3D+dy+b+ecart*2 && xyMouseMove.y < H_3D+dy+b+ecart*2+h_bouton ){
        which_clicked_bouton = "bouton_reinitialiser"
    }
    if (clicked && xyMouseMove.x >= W_3D*0.35+a+2*b+ecart  && xyMouseMove.x <= W_3D*0.35+a+2*b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b+ecart*2 && xyMouseMove.y < H_3D+dy+b+ecart*2+h_bouton ){
        which_clicked_bouton = "bouton_valider"
    }
}

function traitement_bouton(){
    // si on survol, on a les contours qui apparaissent
    survol_bouton()
    // si on click
    get_clicked_bouton()
    switch (which_clicked_bouton){
        // bouton valider pose : on rajoute le bouton à la liste
        case 'bouton_pose':
            console.log('bouton ajout pose', nb_choix_fait)
            // on regarde si la pose sélectionnée n'a pas déjà été choisie avant
            pose_deja_choisie(liste_poses, idx_i, idx_j)
            if (deja_choisie){console.log("Cette pose a déjà été sélectionnée.")}
            // plus de choix possible
            if (nb_choix_fait == nb_choix_demande) {console.log("Tu as déjà fait tes "+nb_choix_demande+" choix.")}
            // si on a pas encore choisie toutes nos poses, on peut en ajouter
            if (nb_choix_fait < nb_choix_demande && !(deja_choisie)){
                liste_poses.push(['choix'+(nb_choix_fait+1),theta, delta, idx_i, idx_j, new Date().getTime() - time_click]) 
                time_click = new Date().getTime()
                nb_choix_fait = nb_choix_fait+1 
                ctxMin.drawImage(cc, 0, 0)
            }
            
            break;

        case 'bouton_retirer':
            console.log('bouton retirer')
            // il y a des poses à retirer
            if (liste_poses.length > 0){
                liste_poses.pop()
                nb_choix_fait = nb_choix_fait-1} 
            // S'il n'y a pas de pose choisie
            else {console.log("Il n'y a pas de pose à retirer.")}
            break;

        case 'bouton_reinitialiser':
            console.log('bouton retirer')
            time_click = new Date().getTime()
            liste_poses = []
            nb_choix_fait = 0
            break;

        case 'bouton_valider':
            console.log('bouton valider', num_tache)
            if (num_tache == nb_mesh){
                console.log("c'est la fin")
                num_tache = num_tache+1}
            if (nb_choix_demande == liste_poses.length && num_tache < nb_mesh){
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
            if (nb_choix_demande < liste_poses.length){
                console.log("Tu n'as pas fait tes 3 choix")
            }
            else{
                console.log("PBL bouton valider")
            }
            break;
    }    
}

function afficher_recap(dict_imgs){
    for (p = 0; p<liste_poses.length; p++){
        // si on survole la pieme image
        ctx.drawImage(dict_imgs['tmp'], W_3D+100, (p+1)*100, dict_imgs['tmp'].width*scale_fleche, dict_imgs['tmp'].height*scale_fleche)
    }
    //ctx.drawImage(canvasMin, 900, 100, 100, 100)
    ctx.drawImage(cc, 0, 0, 800, 800, 900, 100, 800, 800)

}



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

///////////////////////////////////////////////////////////////
///////////////////// FLECHE 

function afficher_fleche(dict_imgs, dy, scale_fleche){
    a = scale_fleche*dict_imgs["gauche"].height
    b = scale_fleche*dict_imgs["gauche"].width
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
function get_clicked_fleche(dict_imgs){
    a = scale_fleche*dict_imgs["gauche"].height
    b = scale_fleche*dict_imgs["gauche"].width
    // Fleche GAUCHE
    if (clicked && xyMouseMove.x >= W_3D*0.35-b  && xyMouseMove.x <= W_3D*0.35 && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        which_clicked = 'gauche'
    }
    // Fleche DROITE
    if (clicked && xyMouseMove.x >= W_3D*0.35+a  && xyMouseMove.x <= W_3D*0.35+a+b && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+a ){
        which_clicked = 'droite'
    }
    // Fleche HAUT
    if (clicked && xyMouseMove.x >= W_3D*0.35  && xyMouseMove.x <= W_3D*0.35+a && xyMouseMove.y > H_3D+dy && xyMouseMove.y < H_3D+dy+b ){
    // l'image devient verte 
        which_clicked = 'haut'
    }
    // Fleche BAS
    if (clicked && xyMouseMove.x >=  W_3D*0.35  && xyMouseMove.x <=  W_3D*0.35+a && xyMouseMove.y > H_3D+dy+b+a && xyMouseMove.y < H_3D+dy+b+a+b ){
        // l'image devient verte 
        which_clicked = 'bas'
    }
}

function traitement_fleche(dict_imgs){
    a = scale_fleche*imgs["gauche"].height
    b = scale_fleche*imgs["gauche"].width
    // Survol des fleches avec la souris
    survol_fleche()
    // click sur une fleche
    get_clicked_fleche(dict_imgs)
    console.log(which_clicked)
    switch (which_clicked){
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
     
    R = 2.5
    theta = 2*Math.PI * ( (2/8)*(idx_j==0) + (1/8)*(idx_j==1) + (-1/8)*(idx_j==3) + (-2/8)*(idx_j==4))
    delta = 2*Math.PI * (idx_i/8)
    //console.log(theta, delta)
    //camera.position.set(R*Math.cos(theta)*Math.cos(delta), R*Math.sin(theta)*Math.cos(delta), R*Math.sin(delta)) // repère wiki
    camera.position.set(R*Math.cos(delta)*Math.cos(theta), R*Math.sin(theta), R*Math.sin(delta)*Math.cos(theta)) // repère JS
    camera.lookAt(0, 0, 0)  


    if (clicked){
        console.log("angles: ",theta, delta)
    }

}

///////////////////////////////////////////////////////////////
///////////////////// BOUTON
function afficher_bouton(dict_boutons, dict_imgs, scale_bouton, scale_fleche){
    h_bouton = scale_bouton*dict_boutons["choix_pose"].height
    w_bouton = scale_bouton*dict_boutons["choix_pose"].width
    ecart = 80 // entre les fleches et le bouton

    a = scale_fleche*dict_imgs["gauche"].height
    b = scale_fleche*dict_imgs["gauche"].width
    // image, posx, posy, W, H
    ctx.drawImage(dict_boutons["choix_pose"], W_3D*0.35+a+b+ecart, H_3D+dy+b, w_bouton, h_bouton)
    ctx.drawImage(dict_boutons["retirer"], W_3D*0.35+a+b+ecart*4, H_3D+dy+b, w_bouton, h_bouton)
}

function survol_bouton(){
    // Choisir le pt de vue
    if (xyMouseMove.x >= W_3D*0.35+a+b+ecart  && xyMouseMove.x <= W_3D*0.35+a+b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        draw_contour(W_3D*0.35+a+b+ecart, H_3D+dy+b, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
    // Retirer 
    if (xyMouseMove.x >= W_3D*0.35+a+b+ecart*4  && xyMouseMove.x <= W_3D*0.35+a+b+ecart*4+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        draw_contour(W_3D*0.35+a+b+ecart*4, H_3D+dy+b, w_bouton, h_bouton, "rgb(255, 0, 255)")
    }
}

function get_clicked_bouton(dict_boutons){
    h_bouton = scale_bouton*dict_boutons["choix_pose"].height
    w_bouton = scale_bouton*dict_boutons["choix_pose"].width

    if (clicked && xyMouseMove.x >= W_3D*0.35+a+b+ecart  && xyMouseMove.x <= W_3D*0.35+a+b+ecart+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        which_clicked = "bouton_pose"
    }
    if (clicked && xyMouseMove.x >= W_3D*0.35+a+b+ecart*4  && xyMouseMove.x <= W_3D*0.35+a+b+ecart*4+w_bouton && xyMouseMove.y > H_3D+dy+b && xyMouseMove.y < H_3D+dy+b+h_bouton ){
        which_clicked = "bouton_retirer"
    }

}

function traitement_bouton(dict_boutons){
    // si on survol, on a les contours qui apparaissent
    survol_bouton()
    // si on click
    get_clicked_bouton(dict_boutons)
    switch (which_clicked){
        // bouton valider pose : on rajoute le bouton à la liste
        case 'bouton_pose':
            console.log('bouton ajout pose')
            liste_poses.push(['choix'+(nb_choix_fait+1),theta, delta, idx_i, idx_j]) 
            nb_choix_fait = nb_choix_fait+1
            break;
        case 'bouton_retirer':
            console.log('bouton retirer')
            // il y a des poses à retirer
            if (liste_poses.length > 0){liste_poses.pop()} 
            // S'il n'y a pas de pose choisie
            else {console.log("Il n'y a pas de pose à retirer.")}
            break;

    }

    //if (clicked){console.log("liste des poses : "+liste_poses)}

    // Si on appuie sur valider
    // verifier que listes_poeses.length == nb_choix_demande
    // choix_courant['choix_poses'] = liste_poses
    // choix['tache_N'+N_tache] = choix_courant
    // choix_courant = {}
    // listes_poses = []
    // N_tache = N_tache+1
    
}
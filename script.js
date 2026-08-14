import * as THREE from "three";


// =====================================================
// CONFIGURACIÓN
// =====================================================

const container =
    document.getElementById("three-container");

const universe =
    document.getElementById("universe");

const intro =
    document.getElementById("intro");

const startButton =
    document.getElementById("startButton");

const musicButton =
    document.getElementById("musicButton");

const helpButton =
    document.getElementById("helpButton");

const helpModal =
    document.getElementById("helpModal");

const closeHelp =
    document.getElementById("closeHelp");

const messageModal =
    document.getElementById("messageModal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const foundMessagesElement =
    document.getElementById("foundMessages");

const totalMessagesElement =
    document.getElementById("totalMessages");

const finalMessage =
    document.getElementById("finalMessage");

const closeFinal =
    document.getElementById("closeFinal");


// =====================================================
// ESCENA
// =====================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x02010a);


// =====================================================
// CÁMARA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
        window.innerHeight,
        0.1,
        3000
    );

camera.position.set(
    0,
    0,
    35
);


// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);


// =====================================================
// LUCES
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1
    );

scene.add(ambientLight);

const pointLight =
    new THREE.PointLight(
        0xff80c8,
        8,
        100
    );

pointLight.position.set(
    0,
    0,
    0
);

scene.add(pointLight);


// =====================================================
// GRUPO PRINCIPAL
// =====================================================

const universeGroup =
    new THREE.Group();

scene.add(universeGroup);


// =====================================================
// ESTRELLAS DEL UNIVERSO
// =====================================================

const starCount = 7000;

const starGeometry =
    new THREE.BufferGeometry();

const starPositions =
    new Float32Array(
        starCount * 3
    );

const starSizes =
    new Float32Array(
        starCount
    );

for (
    let i = 0;
    i < starCount;
    i++
) {

    const radius =
        200 + Math.random() * 1000;

    const theta =
        Math.random() *
        Math.PI * 2;

    const phi =
        Math.acos(
            2 * Math.random() - 1
        );

    const x =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

    const y =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

    const z =
        radius *
        Math.cos(phi);

    starPositions[i * 3] =
        x;

    starPositions[i * 3 + 1] =
        y;

    starPositions[i * 3 + 2] =
        z;

    starSizes[i] =
        Math.random() * 2;
}

starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);

starGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(
        starSizes,
        1
    )
);


const starMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });


const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );

universeGroup.add(stars);


// =====================================================
// ESTRELLAS INTERACTIVAS
// =====================================================

const messages = [

    {
        title: "Para ti ❤️",
        text:
            "No sé en qué momento te convertiste en alguien tan importante para mí, pero hoy sé que tenerte en mi vida es uno de mis regalos favoritos."
    },

    {
        title: "Cuando tengas un día difícil 🌙",
        text:
            "Si algún día sientes que ya no puedes más, ven conmigo. No tienes que explicarme todo. Si necesitas llorar, lloramos. Si necesitas silencio, me quedo contigo. Nunca tendrás que pasar por tus momentos difíciles completamente sola."
    },

    {
        title: "Lo que admiro de ti ✨",
        text:
            "Admiro tu forma de ser, tu manera de seguir adelante y esa parte de ti que quizá tú no siempre ves, pero que para mí hace que seas una persona increíble."
    },

    {
        title: "Un abrazo para ti 🤍",
        text:
            "Si pudiera aparecer frente a ti cada vez que necesitaras un abrazo, créeme que lo haría. Y probablemente me quedaría abrazándote un poquito más de lo necesario."
    },

    {
        title: "Quiero que recuerdes esto 🌌",
        text:
            "No tienes que ser perfecta conmigo. Puedes ser tú, con tus días buenos, tus días malos, tus inseguridades, tus sueños y todo aquello que te hace ser quien eres."
    },

    {
        title: "Mi lugar favorito 💗",
        text:
            "Entre tantos lugares del mundo, hay uno en el que siempre quisiera estar: cerca de ti."
    },

    {
        title: "Para cuando dudes de ti ⭐",
        text:
            "Cuando tú no puedas ver todo lo que vales, déjame recordártelo. Porque hay cosas bonitas en ti que quizá todavía no alcanzas a ver."
    },

    {
        title: "Una promesa 🌹",
        text:
            "No puedo prometer que todos los días serán perfectos, pero sí puedo prometer que mientras esté contigo intentaré que nunca te falte alguien que te escuche, te cuide y te recuerde cuánto vales."
    },

    {
        title: "Nuestro pequeño universo 🪐",
        text:
            "Quizá este universo solamente exista dentro de una pantalla, pero cada palabra que puse aquí tiene un poquito de lo que siento por ti."
    },

    {
        title: "Mi pensamiento favorito 💫",
        text:
            "A veces estoy haciendo cualquier cosa y de repente apareces en mi pensamiento. Y sin darme cuenta, termino sonriendo."
    },

    {
        title: "Si necesitas llorar 🤍",
        text:
            "Nunca voy a juzgar tus lágrimas. Si algún día necesitas sacar todo lo que llevas dentro, puedes hacerlo conmigo. No tienes que esconder lo que sientes."
    },

    {
        title: "Quiero conocerte más 🌙",
        text:
            "Quiero conocer tus sueños, tus miedos, tus pequeñas costumbres, las cosas que te hacen feliz y hasta esas historias que todavía no me has contado."
    },

    {
        title: "Algo que quiero construir ❤️",
        text:
            "No quiero solamente coleccionar momentos bonitos contigo. Quiero construir recuerdos que algún día podamos mirar atrás y decir: qué bonito fue vivir todo esto juntos."
    },

    {
        title: "Si alguna vez te sientes sola ✨",
        text:
            "Mira esta estrella y recuerda que, aunque no pueda estar físicamente a tu lado en cada momento, siempre habrá alguien que quiere verte bien."
    },

    {
        title: "La última estrella 💖",
        text:
            "De todas las estrellas que existen, yo elegiría encontrarte a ti una y otra vez."
    }

];


// =====================================================
// CONTADOR
// =====================================================

let foundMessages = 0;

const discovered =
    new Set();

totalMessagesElement.textContent =
    messages.length;


// =====================================================
// CREAR ESTRELLA INTERACTIVA
// =====================================================

const interactiveStars = [];

const starMaterialInteractive =
    new THREE.MeshBasicMaterial({
        color: 0xffc7e8
    });


messages.forEach(
    (message, index) => {

        const geometry =
            new THREE.SphereGeometry(
                0.35,
                20,
                20
            );

        const star =
            new THREE.Mesh(
                geometry,
                starMaterialInteractive.clone()
            );

        const radius =
            15 + Math.random() * 30;

        const angle =
            Math.random() *
            Math.PI * 2;

        const vertical =
            -15 +
            Math.random() * 30;

        star.position.set(
            Math.cos(angle) * radius,
            vertical,
            Math.sin(angle) * radius
        );

        star.userData = {
            index: index,
            message: message
        };

        universeGroup.add(star);

        interactiveStars.push(star);


        // Aura

        const glowGeometry =
            new THREE.SphereGeometry(
                0.7,
                16,
                16
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xff7fc4,
                transparent: true,
                opacity: 0.15
            });

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        star.add(glow);

    }
);


// =====================================================
// PLANETAS
// =====================================================

function createPlanet(
    radius,
    color,
    position
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            40,
            40
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.1
        });

    const planet =
        new THREE.Mesh(
            geometry,
            material
        );

    planet.position.copy(
        position
    );

    universeGroup.add(
        planet
    );

    return planet;
}


const planet1 =
    createPlanet(
        3,
        0x5b286f,
        new THREE.Vector3(
            -18,
            7,
            -25
        )
    );


const planet2 =
    createPlanet(
        2,
        0x312b78,
        new THREE.Vector3(
            20,
            -10,
            -15
        )
    );


// =====================================================
// ANILLOS DE PLANETAS
// =====================================================

function addRing(
    planet,
    inner,
    outer
) {

    const ringGeometry =
        new THREE.RingGeometry(
            inner,
            outer,
            64
        );

    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffa8dc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45
        });

    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

    ring.rotation.x =
        Math.PI / 2.5;

    planet.add(
        ring
    );
}


addRing(
    planet1,
    4,
    5.5
);


// =====================================================
// CORAZÓN 3D
// =====================================================

function createHeart() {

    const shape =
        new THREE.Shape();

    const x = 0;
    const y = 0;

    shape.moveTo(
        x + 5,
        y + 5
    );

    shape.bezierCurveTo(
        x + 5,
        y + 5,
        x + 4,
        y,
        x,
        y
    );

    shape.bezierCurveTo(
        x - 6,
        y,
        x - 6,
        y + 7,
        x - 6,
        y + 7
    );

    shape.bezierCurveTo(
        x - 6,
        y + 11,
        x - 2,
        y + 15,
        x + 5,
        y + 19
    );

    shape.bezierCurveTo(
        x + 12,
        y + 15,
        x + 16,
        y + 11,
        x + 16,
        y + 7
    );

    shape.bezierCurveTo(
        x + 16,
        y + 7,
        x + 16,
        y,
        x + 10,
        y
    );

    shape.bezierCurveTo(
        x + 6,
        y,
        x + 5,
        y + 5,
        x + 5,
        y + 5
    );

    const geometry =
        new THREE.ExtrudeGeometry(
            shape,
            {
                depth: 2,
                bevelEnabled: true,
                bevelSegments: 5,
                bevelSize: 0.7,
                bevelThickness: 0.7
            }
        );

    geometry.center();

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff3d91,
            emissive: 0x8f164f,
            emissiveIntensity: 1.5,
            metalness: 0.2,
            roughness: 0.3
        });

    const heart =
        new THREE.Mesh(
            geometry,
            material
        );

    heart.scale.set(
        0.35,
        0.35,
        0.35
    );

    heart.rotation.z =
        Math.PI;

    heart.position.set(
        0,
        0,
        0
    );

    universeGroup.add(
        heart
    );

    return heart;
}

const heart =
    createHeart();


// =====================================================
// AURA DEL CORAZÓN
// =====================================================

const heartLight =
    new THREE.PointLight(
        0xff3d91,
        12,
        35
    );

heartLight.position.set(
    0,
    0,
    2
);

universeGroup.add(
    heartLight
);


// =====================================================
// RAYCASTER
// =====================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();


// =====================================================
// MOVIMIENTO DEL MOUSE
// =====================================================

let targetRotationX = 0;
let targetRotationY = 0;

window.addEventListener(
    "mousemove",
    (event) => {

        mouse.x =
            (event.clientX /
                window.innerWidth) *
            2 - 1;

        mouse.y =
            -(event.clientY /
                window.innerHeight) *
            2 + 1;

        targetRotationY =
            mouse.x * 0.35;

        targetRotationX =
            mouse.y * 0.2;

    }
);


// =====================================================
// CLICK
// =====================================================

window.addEventListener(
    "click",
    (event) => {

        mouse.x =
            (event.clientX /
                window.innerWidth) *
            2 - 1;

        mouse.y =
            -(event.clientY /
                window.innerHeight) *
            2 + 1;

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const intersections =
            raycaster.intersectObjects(
                interactiveStars
            );

        if (
            intersections.length === 0
        ) {
            return;
        }

        const star =
            intersections[0].object;

        openMessage(
            star.userData.index,
            star.userData.message
        );

    }
);


// =====================================================
// ABRIR MENSAJE
// =====================================================

function openMessage(
    index,
    message
) {

    modalTitle.textContent =
        message.title;

    modalText.textContent =
        message.text;

    messageModal.classList.add(
        "show"
    );


    if (
        !discovered.has(index)
    ) {

        discovered.add(index);

        foundMessages++;

        foundMessagesElement.textContent =
            foundMessages;

        if (
            foundMessages ===
            messages.length
        ) {

            setTimeout(
                showFinalMessage,
                1500
            );

        }

    }

}


// =====================================================
// CERRAR MENSAJE
// =====================================================

closeModal.addEventListener(
    "click",
    () => {

        messageModal.classList.remove(
            "show"
        );

    }
);


// =====================================================
// CERRAR AL HACER CLICK AFUERA
// =====================================================

messageModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            messageModal
        ) {

            messageModal.classList.remove(
                "show"
            );

        }

    }
);


// =====================================================
// AYUDA
// =====================================================

helpButton.addEventListener(
    "click",
    () => {

        helpModal.classList.add(
            "show"
        );

    }
);

closeHelp.addEventListener(
    "click",
    () => {

        helpModal.classList.remove(
            "show"
        );

    }
);


// =====================================================
// MÚSICA
// =====================================================

let musicPlaying = false;

musicButton.addEventListener(
    "click",
    async () => {

        try {

            if (
                !musicPlaying
            ) {

                await backgroundMusic.play();

                musicPlaying = true;

                musicButton.textContent =
                    "⏸️ Música";

            } else {

                backgroundMusic.pause();

                musicPlaying = false;

                musicButton.textContent =
                    "🎵 Música";

            }

        } catch (error) {

            console.log(
                "No se pudo reproducir la música:",
                error
            );

        }

    }
);


// =====================================================
// INICIAR UNIVERSO
// =====================================================

startButton.addEventListener(
    "click",
    async () => {

        intro.classList.add(
            "hidden"
        );

        universe.classList.add(
            "active"
        );


        try {

            await backgroundMusic.play();

            musicPlaying = true;

            musicButton.textContent =
                "⏸️ Música";

        } catch (error) {

            console.log(
                "El navegador bloqueó la reproducción automática."
            );

        }

    }
);


// =====================================================
// MENSAJE FINAL
// =====================================================

function showFinalMessage() {

    finalMessage.classList.add(
        "show"
    );

}


closeFinal.addEventListener(
    "click",
    () => {

        finalMessage.classList.remove(
            "show"
        );

    }
);


// =====================================================
// ANIMACIÓN
// =====================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();


    // ---------------------------------------------
    // ROTACIÓN DEL UNIVERSO
    // ---------------------------------------------

    universeGroup.rotation.y +=
        0.0008;


    universeGroup.rotation.x +=
        (
            targetRotationX -
            universeGroup.rotation.x
        ) * 0.01;


    universeGroup.rotation.y +=
        (
            targetRotationY -
            universeGroup.rotation.y
        ) * 0.002;


    // ---------------------------------------------
    // ESTRELLAS
    // ---------------------------------------------

    stars.rotation.y =
        elapsed * 0.003;

    stars.rotation.x =
        Math.sin(elapsed * 0.05) *
        0.05;


    // ---------------------------------------------
    // ESTRELLAS INTERACTIVAS
    // ---------------------------------------------

    interactiveStars.forEach(
        (star, index) => {

            const pulse =
                1 +
                Math.sin(
                    elapsed * 2 +
                    index
                ) *
                0.25;

            star.scale.set(
                pulse,
                pulse,
                pulse
            );

        }
    );


    // ---------------------------------------------
    // PLANETAS
    // ---------------------------------------------

    planet1.rotation.y +=
        0.002;

    planet2.rotation.y +=
        0.0015;


    // ---------------------------------------------
    // CORAZÓN
    // ---------------------------------------------

    const heartbeat =
        1 +
        Math.sin(
            elapsed * 3
        ) *
        0.05;

    heart.scale.set(
        0.35 * heartbeat,
        0.35 * heartbeat,
        0.35 * heartbeat
    );

    heart.rotation.y =
        elapsed * 0.4;


    // ---------------------------------------------
    // RENDER
    // ---------------------------------------------

    renderer.render(
        scene,
        camera
    );

}

animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================================================
// TECLADO
// =====================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            messageModal.classList.remove(
                "show"
            );

            helpModal.classList.remove(
                "show"
            );

            finalMessage.classList.remove(
                "show"
            );

        }

    }
);
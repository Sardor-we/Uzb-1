
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(90, 100, 120);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.getElementById("game").appendChild(renderer.domElement);

// Yorug'lik
const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(100, 150, 100);
sunlight.castShadow = true;
scene.add(sunlight);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Yer
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0x579b38 })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Yo'llar
function createRoad(x, z, width, length) {
    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(width, length),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );

    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.15, z);
    scene.add(road);
}

createRoad(0, 0, 16, 500);
createRoad(0, 0, 500, 14);

// Uylar
function createHouse(x, z, color) {
    const house = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(16, 12, 14),
        new THREE.MeshStandardMaterial({ color })
    );

    body.position.y = 6;
    house.add(body);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(12, 9, 4),
        new THREE.MeshStandardMaterial({ color: 0x8b3025 })
    );

    roof.position.y = 16.5;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    house.position.set(x, 0, z);
    scene.add(house);
}

createHouse(35, 35, 0xffd28a);
createHouse(65, 40, 0xe5e5df);
createHouse(-40, 35, 0xe4bd78);
createHouse(-65, -40, 0xd6e2ec);
createHouse(40, -55, 0xffe0a0);

// Daraxtlar
function createTree(x, z) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1.5, 7, 8),
        new THREE.MeshStandardMaterial({ color: 0x704020 })
    );

    trunk.position.y = 3.5;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(5, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x176b28 })
    );

    leaves.position.y = 9;
    tree.add(leaves);

    tree.position.set(x, 0, z);
    scene.add(tree);
}

for (let i = 0; i < 60; i++) {
    const x = Math.random() * 450 - 225;
    const z = Math.random() * 450 - 225;

    if (Math.abs(x) > 20 && Math.abs(z) > 20) {
        createTree(x, z);
    }
}

// Ekin maydonlari
function createField(x, z, color) {
    const field = new THREE.Mesh(
        new THREE.BoxGeometry(70, 0.5, 55),
        new THREE.MeshStandardMaterial({ color })
    );

    field.position.set(x, 0.3, z);
    scene.add(field);
}

createField(120, 100, 0x98752e);
createField(-120, 100, 0xb9a13d);
createField(120, -120, 0x92702c);

// Kamera harakati
function moveCamera(direction) {
    const speed = 15;

    if (direction === "up") camera.position.z -= speed;
    if (direction === "down") camera.position.z += speed;
    if (direction === "left") camera.position.x -= speed;
    if (direction === "right") camera.position.x += speed;

    camera.lookAt(
        camera.position.x - 90,
        0,
        camera.position.z - 120
    );
}

// Sichqoncha bilan boshqarish
let dragging = false;
let lastX = 0;
let lastY = 0;

renderer.domElement.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

window.addEventListener("pointerup", () => {
    dragging = false;
});

window.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    camera.position.x -= (e.clientX - lastX) * 0.4;
    camera.position.z -= (e.clientY - lastY) * 0.4;

    lastX = e.clientX;
    lastY = e.clientY;

    camera.lookAt(0, 0, 0);
});

// O'yin
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Ekran o'lchami
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

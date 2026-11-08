# Mascota del canal en 3D: moneda dorada con cara, sombrero, monóculo, pajarita, brazos y piernas.
# Se ejecuta con el Python de bpy: python build.py   (variables: OUT, RES, FRAMES, ONLY_FRAME, SAMPLES)
import bpy, math, os
from mathutils import Vector

OUT = os.environ.get("OUT", "/tmp/claude-0/mascota3d-out")
RES = int(os.environ.get("RES", "540"))
FRAMES = int(os.environ.get("FRAMES", "150"))
ONLY = os.environ.get("ONLY_FRAME")
SAMPLES = int(os.environ.get("SAMPLES", "48"))
os.makedirs(OUT, exist_ok=True)
PI = math.pi

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def material(name, color, metal=0.0, rough=0.4):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    return m

ORO = material("oro", (1.0, 0.66, 0.10), metal=1.0, rough=0.2)
NEGRO = material("negro", (0.015, 0.015, 0.02), rough=0.35)
BLANCO = material("blanco", (0.95, 0.95, 0.93), rough=0.2)
PUPILA = material("pupila", (0.005, 0.005, 0.01), rough=0.2)
ROJO = material("rojo", (0.8, 0.08, 0.12), rough=0.35)
BOCA = material("boca", (0.10, 0.015, 0.02), rough=0.5)

def setp(child, parent):
    bpy.context.view_layer.update()
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()

def vacio(name, loc=(0, 0, 0), parent=None, rot=(0, 0, 0)):
    o = bpy.data.objects.new(name, None)
    o.empty_display_size = 0.2
    scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = rot
    if parent:
        setp(o, parent)
    return o

def finish(o, m=None, parent=None, smooth=True):
    if m:
        o.data.materials.append(m)
    if smooth:
        for p in o.data.polygons:
            p.use_smooth = True
    if parent:
        setp(o, parent)
    return o

def bisel(o, w=0.03):
    md = o.modifiers.new("bisel", "BEVEL")
    md.width = w
    md.segments = 3
    return o

def cil(name, r, d, loc, rot=(0, 0, 0), m=None, parent=None, bev=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=r, depth=d, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    if bev:
        bisel(o, bev)
    return finish(o, m, parent)

def esf(name, r, loc, scale=(1, 1, 1), m=None, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=r, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    return finish(o, m, parent)

def toro(name, R, r, loc, rot=(0, 0, 0), m=None, parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot,
                                     major_segments=64, minor_segments=12)
    o = bpy.context.active_object
    o.name = name
    return finish(o, m, parent)

def cono(name, r1, d, loc, rot, m=None, parent=None):
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=r1, radius2=0.0, depth=d, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    return finish(o, m, parent)

def cubo(name, loc, scale, m=None, parent=None, bev=0.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    bisel(o, bev)
    return finish(o, m, parent)

# ---- Jerarquía: cuerpo (raíz) -> cabeza, brazos, piernas
body = vacio("cuerpo", (0, 0, 0))
head = vacio("cabeza", (0, 0, 2.35), parent=body)

# Moneda (cara), de frente a la cámara (eje Y)
coin = cil("moneda", 0.95, 0.36, (0, 0, 2.35), rot=(PI / 2, 0, 0), m=ORO, bev=0.04, parent=head)
for yy in (-0.2, 0.2):
    toro(f"borde_{yy}", 0.84, 0.025, (0, yy, 2.35), rot=(PI / 2, 0, 0), m=ORO, parent=head)

# Ojos, pupilas y monóculo (lado del espectador derecho)
ojos = {}
for side, x in (("i", -0.36), ("d", 0.36)):
    ojos[side] = esf(f"ojo_{side}", 0.2, (x, -0.2, 2.52), scale=(1, 0.7, 1.05), m=BLANCO, parent=head)
    esf(f"pupila_{side}", 0.1, (x, -0.31, 2.5), m=PUPILA, parent=head)
toro("monoculo", 0.27, 0.03, (0.36, -0.36, 2.52), rot=(PI / 2, 0, 0), m=ORO, parent=head)
cil("cadena", 0.01, 0.8, (0.66, -0.28, 2.1), rot=(0, 0, 0.2), m=ORO, parent=head)

# Cejas
cejas = [cil("ceja_i", 0.04, 0.34, (-0.36, -0.22, 2.82), rot=(0, PI / 2, 0.25), m=NEGRO, parent=head),
         cil("ceja_d", 0.04, 0.34, (0.36, -0.22, 2.82), rot=(0, PI / 2, -0.25), m=NEGRO, parent=head)]

# Boca: elipsoide oscura con lengua (la boca se anima al hablar)
boca = esf("boca", 0.3, (0, -0.2, 2.02), scale=(1.0, 0.25, 0.42), m=BOCA, parent=head)
esf("lengua", 0.16, (0, -0.24, 1.94), scale=(1, 0.3, 0.5), m=ROJO, parent=head)

# Sombrero de copa (con ligera inclinación)
sombrero = vacio("sombrero", (0, 0, 0), parent=head, rot=(0, 0, 0.1))
cil("ala", 0.92, 0.08, (0, 0, 3.34), m=NEGRO, parent=sombrero)
cil("banda", 0.565, 0.12, (0, 0, 3.42), m=ORO, parent=sombrero)
cil("copa", 0.55, 0.85, (0, 0, 3.77), m=NEGRO, parent=sombrero, bev=0.02)

# Pajarita
for x, rot in ((-0.15, (0, PI / 2, 0)), (0.15, (0, -PI / 2, 0))):
    cono(f"pajarita_{x}", 0.16, 0.26, (x, -0.24, 1.46), rot, m=NEGRO, parent=body)
esf("nudo", 0.07, (0, -0.24, 1.46), m=NEGRO, parent=body)

# Torso (chaqueta negra) y piernas
torso = cubo("torso", (0, 0, 1.02), (0.66, 0.32, 0.62), m=NEGRO, parent=body)

legs = {}
for side, x in (("i", -0.2), ("d", 0.2)):
    pivot = vacio(f"cadera_{side}", (x, 0, 0.72), parent=body)  # pivote en la cadera
    cil(f"pierna_{side}", 0.13, 0.7, (x, 0, 0.37), m=NEGRO, parent=pivot)
    esf(f"zapato_{side}", 0.2, (x, -0.1, 0.11), scale=(1.0, 1.7, 0.6), m=ORO, parent=pivot)
    legs[side] = pivot

# Brazos con guantes dorados (hombros como pivotes)
arms = {}
codos = {}
for side, x in (("i", -0.72), ("d", 0.72)):
    pivot = vacio(f"hombro_{side}", (x, 0, 1.2), parent=body)
    cil(f"brazo_{side}", 0.13, 0.46, (x, 0, 0.97), m=ORO, parent=pivot)
    codo = vacio(f"codo_{side}", (x, 0, 0.74), parent=pivot)
    cil(f"antebrazo_{side}", 0.12, 0.46, (x, 0, 0.51), m=ORO, parent=codo)
    esf(f"guante_{side}", 0.19, (x, 0, 0.27), m=ORO, parent=codo)
    arms[side] = pivot
    codos[side] = codo

# ---- Animación en bucle (FRAMES fotogramas, periódica)
def sinus(k, amp, off=0.0, fase=0.0):
    return lambda f: off + amp * math.sin(2 * PI * k * f / FRAMES + fase)

def anima(obj, prop, idx, fn, paso=5):
    arr = getattr(obj, prop)
    for f0 in list(range(0, FRAMES + 1, paso)):
        arr[idx] = fn(f0)
        obj.keyframe_insert(data_path=prop, index=idx, frame=f0 + 1)

# Cuerpo: rebote suave y balanceo lateral (como presentador que se mueve)
anima(body, "location", 2, lambda f: 0.05 * abs(math.sin(2 * PI * 2 * f / FRAMES)))
anima(body, "location", 0, sinus(1, 0.08))
anima(body, "rotation_euler", 2, sinus(1, 0.05))
# Cabeza: inclinación y giro hacia la cámara
anima(head, "rotation_euler", 2, sinus(1, 0.07, fase=0.6))
anima(head, "rotation_euler", 0, sinus(2, 0.03))
anima(head, "rotation_euler", 1, sinus(1, 0.05, fase=1.2))
# Sombrero: ligero vaivén
anima(sombrero, "rotation_euler", 2, sinus(2, 0.03))
# Brazo izquierdo (espectador): se mueve al explicar; brazo derecho: gesto de señalar
anima(arms["d"], "rotation_euler", 0, sinus(1, 0.35, off=-0.7))
anima(arms["d"], "rotation_euler", 2, sinus(2, 0.15, off=-0.35))
anima(codos["d"], "rotation_euler", 0, sinus(2, 0.35, off=-0.9, fase=0.5))
anima(arms["i"], "rotation_euler", 0, sinus(2, 0.2, off=-0.2, fase=0.9))
anima(arms["i"], "rotation_euler", 2, sinus(1, 0.12, off=0.15))
anima(codos["i"], "rotation_euler", 0, sinus(1, 0.2, off=-0.4, fase=1.5))
# Piernas: paso suave en el sitio
anima(legs["i"], "rotation_euler", 0, sinus(1, 0.1))
anima(legs["d"], "rotation_euler", 0, sinus(1, 0.1, fase=PI))
# Boca: habla con varios ritmos
anima(boca, "scale", 2, lambda f: 0.42 * (0.45 + 0.35 * abs(math.sin(2 * PI * 3 * f / FRAMES)) + 0.2 * abs(math.sin(2 * PI * 7 * f / FRAMES))) / 0.42 * 0.42 + 0.02)
# Parpadeo (dos veces por bucle)
def parpadeo(f):
    for c in (30, 112):
        if abs(f - c) <= 2:
            return 0.1
    return 1.0
for side in ("i", "d"):
    anima(ojos[side], "scale", 2, lambda f: 1.05 * parpadeo(f))
    anima(bpy.data.objects[f"pupila_{side}"], "scale", 2, lambda f: parpadeo(f))

# ---- Luces, cámara y fondo
world = scene.world or bpy.data.worlds.new("mundo")
scene.world = world
world.use_nodes = True
fondo = world.node_tree.nodes.get("Background")
fondo.inputs["Color"].default_value = (0.30, 0.30, 0.34, 1.0)
fondo.inputs["Strength"].default_value = 0.9

objetivo = vacio("objetivo", (0, 0, 2.2))

def luz(name, tipo, loc, energia, tam, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, tipo)
    d.energy = energia
    d.color = color
    if tipo == "AREA":
        d.size = tam
    o = bpy.data.objects.new(name, d)
    scene.collection.objects.link(o)
    o.location = loc
    c = o.constraints.new("TRACK_TO")
    c.target = objetivo
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return o

luz("clave", "AREA", (-3.5, -6, 5.5), 1400, 4.0)
luz("relleno", "AREA", (4.5, -5, 2.5), 300, 5.0, color=(1, 0.95, 0.88))
luz("contraluz", "AREA", (0, 6, 4.5), 1200, 3.0, color=(1, 0.9, 0.7))

cam_d = bpy.data.cameras.new("camara")
cam_d.lens = 50
cam = bpy.data.objects.new("camara", cam_d)
scene.collection.objects.link(cam)
cam.location = (0, -9.0, 2.2)
c = cam.constraints.new("TRACK_TO")
c.target = objetivo
c.track_axis = "TRACK_NEGATIVE_Z"
c.up_axis = "UP_Y"
scene.camera = cam

# ---- Render
r = scene.render
r.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
r.resolution_x = RES
r.resolution_y = RES
r.resolution_percentage = 100
r.film_transparent = True
r.image_settings.file_format = "PNG"
r.image_settings.color_mode = "RGBA"
scene.frame_start = 1
scene.frame_end = FRAMES
scene.render.fps = 30

if ONLY:
    frames = [int(ONLY)]
else:
    frames = list(range(1, FRAMES + 1))
for f in frames:
    scene.frame_set(f)
    r.filepath = os.path.join(OUT, f"frame_{f:04d}.png")
    bpy.ops.render.render(write_still=True)
    print("ok", f, flush=True)

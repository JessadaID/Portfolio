<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const spacing = 100; // ระยะห่างแต่ละ diamond
  const radius = 200; // ระยะตรวจจับเมาส์
  let mouse = { x: -9999, y: -9999 };

  let points: { x: number, y: number }[] = [];
  let connections: { alpha: number; progress: number; visible: boolean }[] = [];

  function generateDiamondGrid(width: number, height: number) {
    points = [];
    for (let row = 0; row < height / spacing + 1; row++) {
      for (let col = 0; col < width / spacing + 1; col++) {
        const offsetX = (row % 2 === 0) ? 0 : spacing / 2;
        const x = col * spacing + offsetX;
        const y = row * spacing * 0.6; // 0.6 เพื่อให้ diamond แน่นพอดี
        points.push({ x, y });
      }
    }
    // ตั้งค่าการแสดงผลของเส้นเชื่อมสำหรับแต่ละจุด
    connections = points.map(() => ({ alpha: 0, progress: 0, visible: false }));
  }

  function drawDiamond(x: number, y: number, size = 10) {
    ctx.beginPath();
    ctx.moveTo(x, y - size); // top
    ctx.lineTo(x + size, y); // right
    ctx.lineTo(x, y + size); // bottom
    ctx.lineTo(x - size, y); // left
    ctx.closePath();
    ctx.fillStyle = '#22577A';
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((p, i) => {
      const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
      const near = dist <= radius;

      connections[i].visible = near;

      if (near) {
        connections[i].alpha = Math.min(1, connections[i].alpha + 0.05);
        connections[i].progress = Math.min(1, connections[i].progress + 0.05);
      } else {
        connections[i].alpha = Math.max(0, connections[i].alpha - 0.05);
        connections[i].progress = Math.max(0, connections[i].progress - 0.05);
      }

      // วาด diamond
      drawDiamond(p.x, p.y, 10);

      // วาดเส้นโค้งแบบ fade
      if (connections[i].alpha > 0.01) {
        const t = connections[i].progress;
        const cx = (mouse.x + p.x) / 2;
        const cy = (mouse.y + p.y) / 2 - 50;

        const interpX = mouse.x + (p.x - mouse.x) * t;
        const interpY = mouse.y + (p.y - mouse.y) * t;
        const interpCX = mouse.x + (cx - mouse.x) * t;
        const interpCY = mouse.y + (cy - mouse.y) * t;

        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.quadraticCurveTo(interpCX, interpCY, interpX, interpY);
        ctx.strokeStyle = `rgba(100, 150, 255, ${connections[i].alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    requestAnimationFrame(animate);
  }

  onMount(() => {
    const width = window.innerWidth;
    const height = 1000;

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d')!;
    generateDiamondGrid(width, height);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    animate();
  });
</script>

<canvas bind:this={canvas}  />

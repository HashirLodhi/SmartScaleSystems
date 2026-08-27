const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const seo = require('../seo.config.cjs');

const root = path.join(__dirname, '..');
const outputDir = path.join(root, 'public', 'og');
const fallbackPath = path.join(root, 'public', 'og.png');
const logoPath = path.join(root, 'public', 'logo-main.png');

const WIDTH = 1536;
const HEIGHT = 1024;
const CARD_X = 72;
const CARD_Y = 72;
const CARD_W = 800;
const CARD_H = 880;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function routeSlug(route) {
  if (route.path === '/') return 'home';
  return route.path.replace(/^\//, '').replace(/\//g, '-');
}

function routeHeadline(route) {
  if (route.path === '/') return 'Custom AI Systems and Automation';
  if (route.path === '/services') return 'AI Development and Automation Services';
  if (route.path === '/projects') return 'Selected AI Projects';
  if (route.path === '/team') return 'Meet the Team';
  if (route.path === '/contact') return 'Start Your AI Project';
  if (route.path === '/privacy-policy') return 'Privacy Policy';
  if (route.path === '/terms-of-service') return 'Terms of Service';
  return route.title.split('|')[0].trim();
}

function routeLabel(route) {
  if (route.path === '/') return 'HOMEPAGE';
  if (route.path === '/services') return 'SERVICES';
  if (route.path === '/projects') return 'PROJECTS';
  if (route.path === '/team') return 'TEAM';
  if (route.path === '/contact') return 'CONTACT';
  if (route.path === '/privacy-policy' || route.path === '/terms-of-service') return 'LEGAL';
  return 'SERVICE PAGE';
}

function routeSubtitle(route) {
  if (route.type === 'service') {
    return route.description;
  }
  if (route.path === '/') {
    return route.description;
  }
  if (route.path === '/services') {
    return 'Explore custom agents, automation, computer vision, NLP, LLMs, data annotation, training data, and integrations.';
  }
  if (route.path === '/projects') {
    return 'See a curated set of technical prototypes, applied AI systems, and delivery-focused experiments.';
  }
  if (route.path === '/team') {
    return 'Meet the AI engineers, operators, and delivery specialists behind the work.';
  }
  if (route.path === '/contact') {
    return 'Tell us about the workflow, product, or dataset problem you want to solve.';
  }
  return route.description;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth) {
      line = trial;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function fitWrappedText(ctx, text, maxWidth, maxLines, maxSize, minSize, weight, family) {
  for (let size = maxSize; size >= minSize; size -= 2) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length <= maxLines) {
      return { size, lines };
    }
  }

  ctx.font = `${weight} ${minSize}px ${family}`;
  const lines = wrapLines(ctx, text, maxWidth).slice(0, maxLines);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    let trimmed = last;
    while (trimmed.length > 3 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
      trimmed = trimmed.slice(0, -1);
    }
    lines[maxLines - 1] = `${trimmed.trim()}...`;
  }
  return { size: minSize, lines };
}

function drawWrappedText(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((part) => part + part).join('')
    : value;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawBackground(ctx, routeIndex) {
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#050505');
  bg.addColorStop(0.55, '#0d0d0d');
  bg.addColorStop(1, '#171717');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glowA = ctx.createRadialGradient(1160, 220, 20, 1160, 220, 520);
  glowA.addColorStop(0, 'rgba(255,255,255,0.18)');
  glowA.addColorStop(0.28, 'rgba(255,255,255,0.08)');
  glowA.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glowB = ctx.createRadialGradient(1140, 800, 20, 1140, 800, 500);
  glowB.addColorStop(0, 'rgba(255,255,255,0.08)');
  glowB.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  const dotCount = 520;
  for (let i = 0; i < dotCount; i += 1) {
    const x = (Math.sin((routeIndex + 1) * 17.7 + i * 1.31) * 0.5 + 0.5) * WIDTH;
    const y = (Math.cos((routeIndex + 1) * 8.3 + i * 1.17) * 0.5 + 0.5) * HEIGHT;
    const radius = 0.6 + ((i * 17) % 13) / 10;
    ctx.fillStyle = `rgba(255,255,255,${0.05 + ((i * 11) % 7) / 80})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCard(ctx) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 18;
  drawRoundedRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 42);
  ctx.fillStyle = 'rgba(248, 248, 246, 0.98)';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(17, 17, 17, 0.08)';
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(17,17,17,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i += 1) {
    const x = CARD_X + 40 + i * 72;
    ctx.beginPath();
    ctx.moveTo(x, CARD_Y + 78);
    ctx.lineTo(x, CARD_Y + CARD_H - 72);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLogo(ctx, image) {
  const maxW = 300;
  const maxH = 110;
  const scale = Math.min(maxW / image.trimWidth, maxH / image.trimHeight, 1);
  const width = Math.round(image.trimWidth * scale);
  const height = Math.round(image.trimHeight * scale);
  const x = CARD_X + 44;
  const y = CARD_Y + 36;
  ctx.drawImage(image, image.trimX, image.trimY, image.trimWidth, image.trimHeight, x, y, width, height);
}

function trimOpaqueBounds(image) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, image.width, image.height);

  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = data[(y * image.width + x) * 4 + 3];
      if (alpha > 6) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return {
      trimX: 0,
      trimY: 0,
      trimWidth: image.width,
      trimHeight: image.height,
    };
  }

  const padX = Math.max(12, Math.round((maxX - minX + 1) * 0.08));
  const padY = Math.max(12, Math.round((maxY - minY + 1) * 0.08));
  return {
    trimX: clamp(minX - padX, 0, image.width - 1),
    trimY: clamp(minY - padY, 0, image.height - 1),
    trimWidth: clamp(maxX - minX + 1 + padX * 2, 1, image.width),
    trimHeight: clamp(maxY - minY + 1 + padY * 2, 1, image.height),
  };
}

function drawTitleBlock(ctx, route) {
  const labelX = CARD_X + 46;
  let y = CARD_Y + 168;
  ctx.fillStyle = 'rgba(17,17,17,0.6)';
  ctx.font = '600 18px "Cabin", "Segoe UI", Arial, sans-serif';
  ctx.fillText(`SMART SCALE SYSTEMS  /  ${routeLabel(route)}`, labelX, y);

  y += 54;
  ctx.fillStyle = '#090909';
  const titleWrap = fitWrappedText(
    ctx,
    routeHeadline(route),
    640,
    3,
    78,
    52,
    '700',
    '"Cabin", "Segoe UI", Arial, sans-serif'
  );
  ctx.font = `700 ${titleWrap.size}px "Cabin", "Segoe UI", Arial, sans-serif`;
  drawWrappedText(ctx, titleWrap.lines, labelX, y, Math.round(titleWrap.size * 1.02));

  const titleHeight = titleWrap.lines.length * Math.round(titleWrap.size * 1.02);
  y += titleHeight + 34;
  ctx.fillStyle = 'rgba(17,17,17,0.72)';
  const bodyWrap = fitWrappedText(
    ctx,
    routeSubtitle(route),
    660,
    4,
    36,
    26,
    '400',
    '"Cabin", "Segoe UI", Arial, sans-serif'
  );
  ctx.font = `400 ${bodyWrap.size}px "Cabin", "Segoe UI", Arial, sans-serif`;
  drawWrappedText(ctx, bodyWrap.lines, labelX, y, Math.round(bodyWrap.size * 1.42));

  const bodyHeight = bodyWrap.lines.length * Math.round(bodyWrap.size * 1.42);
  y += bodyHeight + 44;

  ctx.save();
  ctx.strokeStyle = 'rgba(17,17,17,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(labelX, y);
  ctx.lineTo(CARD_X + CARD_W - 48, y);
  ctx.stroke();
  ctx.restore();

  const badges = [route.type === 'service' ? 'SERVICE' : route.type.toUpperCase(), 'AI DEVELOPMENT', 'BRANDED PREVIEW'];
  let badgeX = labelX;
  const badgeY = y + 26;
  badges.forEach((badge) => {
    ctx.font = '700 18px "Cabin", "Segoe UI", Arial, sans-serif';
    const textWidth = ctx.measureText(badge).width;
    const badgeW = textWidth + 28;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, 42, 21);
    ctx.fillStyle = 'rgba(17,17,17,0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(17,17,17,0.08)';
    ctx.stroke();
    ctx.fillStyle = '#111111';
    ctx.fillText(badge, badgeX + 14, badgeY + 27);
    badgeX += badgeW + 14;
  });
}

function drawNode(ctx, x, y, radius, fill = 'rgba(255,255,255,0.9)') {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2, width = 2, color = 'rgba(255,255,255,0.45)') {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawMotifHome(ctx) {
  const cx = 1188;
  const cy = 520;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.42)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 210 + i * 32, 110 + i * 18, -0.2 + i * 0.06, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawLine(ctx, cx - 250, cy + 10, cx + 230, cy - 62, 2, 'rgba(255,255,255,0.32)');
  drawLine(ctx, cx - 190, cy + 128, cx + 145, cy + 182, 2, 'rgba(255,255,255,0.28)');
  [[980, 420], [1082, 320], [1244, 300], [1360, 410], [1324, 652], [1138, 708], [1024, 608]]
    .forEach(([x, y], index) => drawNode(ctx, x, y, index === 2 ? 11 : 7));
  ctx.restore();
}

function drawMotifPanels(ctx) {
  const startX = 1044;
  const startY = 260;
  for (let i = 0; i < 4; i += 1) {
    ctx.save();
    ctx.translate(startX + i * 86, startY + i * 40);
    ctx.rotate(-0.02 * i);
    drawRoundedRect(ctx, 0, 0, 210, 290, 16);
    ctx.fillStyle = i === 2 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.11)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let y = 42; y < 250; y += 26) {
      ctx.fillRect(26, y, 156, 2);
    }
    ctx.restore();
  }
}

function drawMotifTeam(ctx) {
  const centers = [
    [1040, 350],
    [1210, 320],
    [1360, 380],
    [1124, 620],
  ];
  centers.forEach(([x, y], index) => {
    ctx.save();
    ctx.fillStyle = index % 2 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.22)';
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 58 + index * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  drawLine(ctx, 1040, 350, 1210, 320, 2);
  drawLine(ctx, 1210, 320, 1360, 380, 2);
  drawLine(ctx, 1210, 320, 1124, 620, 2);
  drawLine(ctx, 1040, 350, 1124, 620, 2);
}

function drawMotifContact(ctx) {
  const x = 1032;
  const y = 330;
  drawLine(ctx, x, y + 220, x + 180, y + 220, 2.5);
  drawLine(ctx, x, y + 220, x + 120, y + 96, 2.5);
  drawLine(ctx, x + 120, y + 96, x + 260, y + 96, 2.5);
  drawLine(ctx, x + 260, y + 96, x + 360, y - 18, 2.5);
  [[x, y + 220], [x + 120, y + 96], [x + 260, y + 96], [x + 360, y - 18]]
    .forEach(([nx, ny], index) => drawNode(ctx, nx, ny, index === 3 ? 10 : 8));
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 1128, 300, 300, 200, 28);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1160, 344);
  ctx.lineTo(1328, 344);
  ctx.lineTo(1328, 392);
  ctx.lineTo(1188, 392);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawMotifLegal(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 1078, 286, 314, 430, 24);
  ctx.stroke();
  drawRoundedRect(ctx, 1108, 316, 314, 430, 24);
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    const y = 364 + i * 44;
    drawLine(ctx, 1140, y, 1360, y, 2, 'rgba(255,255,255,0.24)');
  }
  ctx.beginPath();
  ctx.arc(1280, 588, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMotifService(ctx, route) {
  const slug = routeSlug(route);
  if (slug === 'services') return drawMotifPanels(ctx);
  if (slug === 'projects') return drawMotifPanels(ctx);
  if (slug === 'team') return drawMotifTeam(ctx);
  if (slug === 'contact') return drawMotifContact(ctx);
  if (slug === 'privacy-policy' || slug === 'terms-of-service') return drawMotifLegal(ctx);

  const map = {
    'services-ai-model-training': 'training',
    'services-ai-automation': 'automation',
    'services-custom-ai-agents': 'agents',
    'services-data-analytics': 'analytics',
    'services-ai-integrations': 'integrations',
    'services-business-automations': 'workflow',
    'services-computer-vision': 'vision',
    'services-nlp': 'nlp',
    'services-llm': 'llm',
    'services-data-annotation': 'annotation',
    'services-ai-training-data': 'training-data',
    'services-custom': 'custom',
  };

  const variant = map[slug] || 'custom';
  const baseX = 1044;
  const baseY = 276;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;

  if (variant === 'training') {
    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.translate(baseX + i * 74, baseY + i * 48);
      ctx.rotate(-0.06);
      drawRoundedRect(ctx, 0, 0, 210, 84, 14);
      ctx.stroke();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.restore();
    }
  } else if (variant === 'automation' || variant === 'workflow') {
    const points = [[1048, 384], [1174, 384], [1174, 290], [1326, 290], [1326, 482], [1440, 482]];
    points.forEach(([x, y], index) => drawNode(ctx, x, y, index % 2 === 0 ? 8 : 6));
    for (let i = 0; i < points.length - 1; i += 1) {
      drawLine(ctx, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], 2.5);
    }
    ctx.beginPath();
    ctx.arc(1348, 606, 130, -1.2, 1.5);
    ctx.stroke();
  } else if (variant === 'agents') {
    drawNode(ctx, 1240, 436, 24, 'rgba(255,255,255,0.88)');
    const satellites = [[1114, 352], [1364, 350], [1096, 586], [1388, 586]];
    satellites.forEach(([x, y]) => {
      drawLine(ctx, 1240, 436, x, y, 2.2);
      drawNode(ctx, x, y, 14);
    });
  } else if (variant === 'analytics') {
    const bars = [60, 130, 96, 168];
    bars.forEach((barH, index) => {
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.fillRect(baseX + index * 86, 600 - barH, 48, barH);
    });
    ctx.beginPath();
    ctx.moveTo(1034, 516);
    ctx.bezierCurveTo(1148, 500, 1214, 412, 1294, 430);
    ctx.bezierCurveTo(1360, 446, 1410, 390, 1450, 360);
    ctx.stroke();
    [[1034, 516], [1176, 468], [1294, 430], [1450, 360]].forEach(([x, y]) => drawNode(ctx, x, y, 7));
  } else if (variant === 'integrations') {
    drawLine(ctx, 1088, 414, 1262, 414, 2.5);
    drawLine(ctx, 1262, 414, 1384, 316, 2.5);
    drawLine(ctx, 1262, 414, 1384, 512, 2.5);
    drawLine(ctx, 1262, 414, 1384, 608, 2.5);
    [[1088, 414], [1262, 414], [1384, 316], [1384, 512], [1384, 608]].forEach(([x, y], index) => drawNode(ctx, x, y, index === 1 ? 10 : 8));
    ctx.beginPath();
    ctx.arc(1306, 414, 92, 0.1, Math.PI * 1.8);
    ctx.stroke();
  } else if (variant === 'vision') {
    drawRoundedRect(ctx, 1060, 304, 420, 310, 28);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      drawLine(ctx, 1094 + i * 62, 342, 1094 + i * 62, 586, 1.4, 'rgba(255,255,255,0.26)');
    }
    for (let i = 0; i < 5; i += 1) {
      drawLine(ctx, 1094, 366 + i * 52, 1450, 366 + i * 52, 1.4, 'rgba(255,255,255,0.26)');
    }
    ctx.beginPath();
    ctx.arc(1270, 458, 86, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1270, 458, 20, 0, Math.PI * 2);
    ctx.stroke();
  } else if (variant === 'nlp') {
    const bubbles = [
      [1068, 368, 280, 140],
      [1248, 520, 304, 140],
    ];
    bubbles.forEach(([x, y, w, h]) => {
      drawRoundedRect(ctx, x, y, w, h, 28);
      ctx.stroke();
    });
    drawLine(ctx, 1104, 452, 1260, 452, 2);
    drawLine(ctx, 1104, 482, 1202, 482, 2);
    drawLine(ctx, 1280, 604, 1422, 604, 2);
    drawLine(ctx, 1280, 634, 1382, 634, 2);
  } else if (variant === 'llm') {
    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.translate(1098 + i * 78, 360 + i * 28);
      drawRoundedRect(ctx, 0, 0, 226, 116, 20);
      ctx.stroke();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.restore();
    }
    drawLine(ctx, 1108, 580, 1450, 580, 2.5);
  } else if (variant === 'annotation') {
    const boxes = [
      [1084, 332, 160, 120],
      [1290, 320, 188, 128],
      [1120, 522, 174, 126],
      [1350, 510, 150, 120],
    ];
    boxes.forEach(([x, y, w, h], index) => {
      ctx.save();
      ctx.strokeStyle = index % 2 === 0 ? 'rgba(255,255,255,0.46)' : 'rgba(255,255,255,0.28)';
      drawRoundedRect(ctx, x, y, w, h, 16);
      ctx.stroke();
      ctx.restore();
    });
    [[1158, 392], [1350, 384], [1206, 584], [1416, 568]].forEach(([x, y]) => drawNode(ctx, x, y, 6));
  } else if (variant === 'training-data') {
    for (let i = 0; i < 5; i += 1) {
      ctx.save();
      ctx.translate(1072 + i * 66, 330 + (i % 2) * 34);
      drawRoundedRect(ctx, 0, 0, 130, 188, 18);
      ctx.stroke();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.restore();
    }
    drawLine(ctx, 1114, 602, 1432, 602, 2);
    drawNode(ctx, 1114, 602, 8);
    drawNode(ctx, 1432, 602, 8);
  } else {
    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.translate(1082 + i * 94, 330 + i * 38);
      ctx.rotate(i % 2 ? 0.08 : -0.08);
      drawRoundedRect(ctx, 0, 0, 166, 166, 26);
      ctx.stroke();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawFooterMark(ctx, route) {
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 16px "Cabin", "Segoe UI", Arial, sans-serif';
  const footer = `${routeLabel(route)}  /  smartscalesystems.tech`;
  ctx.fillText(footer, 988, 930);
}

async function renderRoute(route, logoImage) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  ctx.antialias = 'subpixel';
  drawBackground(ctx, seo.routes.indexOf(route));
  drawCard(ctx);
  drawLogo(ctx, logoImage);
  drawTitleBlock(ctx, route);
  drawMotifService(ctx, route);
  drawFooterMark(ctx, route);
  return canvas.toBuffer('image/png');
}

async function main() {
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo not found: ${logoPath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const logoImage = await loadImage(logoPath);
  Object.assign(logoImage, trimOpaqueBounds(logoImage));

  for (const route of seo.routes) {
    const buffer = await renderRoute(route, logoImage);
    const fileName = `${routeSlug(route)}.png`;
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, buffer);
    if (route.path === '/') {
      fs.writeFileSync(fallbackPath, buffer);
    }
    console.log(`Wrote ${path.relative(root, outputPath)}`);
  }

  console.log(`Updated fallback preview at ${path.relative(root, fallbackPath)}`);
}

main().catch((error) => {
  console.error(`OG image generation failed: ${error.message}`);
  process.exit(1);
});

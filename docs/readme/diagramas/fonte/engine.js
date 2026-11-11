/*
 * Desenha um diagrama a partir de uma especificação (specs.js) e anima com Motion.
 *
 * A timeline do Motion fica pausada e é exposta em window.diagram, para que o script
 * render.mjs avance quadro a quadro (controls.time = t) e monte o GIF de forma
 * determinística. Abrindo o HTML no navegador, a animação toca em loop.
 */
;(function () {
  const { animate } = window.Motion
  const SVG = 'http://www.w3.org/2000/svg'

  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(SVG, name)
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value)
    if (parent) parent.appendChild(node)
    return node
  }

  const anchor = (node, side) => {
    const { x, y, w, h } = node
    if (side === 'left') return { x, y: y + h / 2, nx: -1, ny: 0 }
    if (side === 'right') return { x: x + w, y: y + h / 2, nx: 1, ny: 0 }
    if (side === 'top') return { x: x + w / 2, y, nx: 0, ny: -1 }
    return { x: x + w / 2, y: y + h, nx: 0, ny: 1 }
  }

  const autoSides = (a, b) => {
    const dx = b.x + b.w / 2 - (a.x + a.w / 2)
    const dy = b.y + b.h / 2 - (a.y + a.h / 2)
    if (Math.abs(dx) > Math.abs(dy) * 0.9) return dx > 0 ? ['right', 'left'] : ['left', 'right']
    return dy > 0 ? ['bottom', 'top'] : ['top', 'bottom']
  }

  /** Curva suave entre dois nós; `bend` desloca os pontos de controle. */
  const edgePath = (a, b, edge) => {
    if (edge.d) return edge.d
    const [fromSide, toSide] = edge.sides || autoSides(a, b)
    const p = anchor(a, fromSide)
    const q = anchor(b, toSide)
    const dist = Math.hypot(q.x - p.x, q.y - p.y)
    const k = edge.curve ?? Math.min(120, Math.max(40, dist * 0.4))
    const c1 = { x: p.x + p.nx * k, y: p.y + p.ny * k }
    const c2 = { x: q.x + q.nx * k, y: q.y + q.ny * k }
    return `M ${p.x} ${p.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${q.x} ${q.y}`
  }

  function textLines(parent, lines, cx, cy, cls, lineHeight) {
    const top = cy - ((lines.length - 1) * lineHeight) / 2
    lines.forEach((line, index) => {
      const t = el('text', { x: cx, y: top + index * lineHeight, class: cls }, parent)
      t.textContent = line
    })
  }

  function drawNode(layer, node) {
    const g = el('g', { class: `node node-${node.kind || 'box'}` }, layer)
    const { x, y, w, h } = node
    const cx = x + w / 2
    const cy = y + h / 2
    switch (node.kind) {
      case 'actor':
        el('rect', { x, y, width: w, height: h, rx: h / 2 }, g)
        break
      case 'db': {
        const ry = 10
        el('path', {
          d: `M ${x} ${y + ry} A ${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry} V ${y + h - ry} A ${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry} Z`,
        }, g)
        el('path', { class: 'db-lid', d: `M ${x} ${y + ry} A ${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry}` }, g)
        break
      }
      case 'decision':
        el('path', { d: `M ${cx} ${y} L ${x + w} ${cy} L ${cx} ${y + h} L ${x} ${cy} Z` }, g)
        break
      case 'dot':
        el('circle', { cx, cy, r: w / 2 }, g)
        return g
      case 'end':
        el('circle', { class: 'ring', cx, cy, r: w / 2 }, g)
        el('circle', { cx, cy, r: w / 2 - 6 }, g)
        return g
      case 'accent':
      case 'muted':
      default:
        el('rect', { x, y, width: w, height: h, rx: 14 }, g)
    }
    const lines = Array.isArray(node.label) ? node.label : [node.label]
    const sub = node.sub ? (Array.isArray(node.sub) ? node.sub : [node.sub]) : []
    const total = lines.length * 19 + sub.length * 16 + (sub.length ? 4 : 0)
    const start = cy - total / 2 + 14
    lines.forEach((line, i) => {
      const t = el('text', { x: cx, y: start + i * 19, class: 'label' }, g)
      t.textContent = line
    })
    sub.forEach((line, i) => {
      const t = el('text', { x: cx, y: start + lines.length * 19 + 4 + i * 16, class: 'sub' }, g)
      t.textContent = line
    })
    return g
  }

  function drawEdgeLabel(layer, path, text, at = 0.5) {
    const point = path.getPointAtLength(path.getTotalLength() * at)
    const g = el('g', { class: 'edge-label' }, layer)
    const lines = Array.isArray(text) ? text : [text]
    const t = el('text', { x: point.x, y: point.y }, g)
    lines.forEach((line, i) => {
      const span = el('tspan', { x: point.x, dy: i === 0 ? `${-((lines.length - 1) * 7) + 4}` : '14' }, t)
      span.textContent = line
    })
    const box = t.getBBox()
    const bg = el('rect', {
      x: box.x - 8, y: box.y - 3, width: box.width + 16, height: box.height + 6, rx: 8,
    })
    g.insertBefore(bg, t)
    return g
  }

  /** Ponta de seta desenhada à parte, para surgir só quando o traço chega ao fim. */
  function arrowHead(layer, path, tone) {
    const length = path.getTotalLength()
    const tip = path.getPointAtLength(length)
    const back = path.getPointAtLength(Math.max(0, length - 6))
    const angle = (Math.atan2(tip.y - back.y, tip.x - back.x) * 180) / Math.PI
    const head = el('path', {
      d: 'M -9 -5.5 L 1 0 L -9 5.5 Z',
      class: `arrowhead ${tone || ''}`,
      transform: `translate(${tip.x} ${tip.y}) rotate(${angle})`,
      opacity: 0,
    }, layer)
    return head
  }

  function build(spec) {
    const stage = document.getElementById('stage')
    stage.style.width = `${spec.width}px`
    stage.style.height = `${spec.height}px`
    const svg = el('svg', { width: spec.width, height: spec.height, viewBox: `0 0 ${spec.width} ${spec.height}` })
    stage.appendChild(svg)

    const defs = el('defs', {}, svg)
    for (const [id, cls] of [['arrow', 'arrowhead'], ['arrow-accent', 'arrowhead accent'], ['arrow-muted', 'arrowhead muted'], ['arrow-error', 'arrowhead error']]) {
      const m = el('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, defs)
      el('path', { d: 'M 1 1 L 9 5 L 1 9 z', class: cls }, m)
    }

    const groupLayer = el('g', {}, svg)
    const edgeLayer = el('g', {}, svg)
    const nodeLayer = el('g', {}, svg)
    const labelLayer = el('g', {}, svg)
    const pulseLayer = document.createElement('div')
    pulseLayer.className = 'pulses'
    stage.appendChild(pulseLayer)

    const nodes = Object.fromEntries((spec.nodes || []).map((n) => [n.id, n]))
    const seq = []
    const time = { t: 0 }
    const at = (dt) => time.t + dt

    // Título
    if (spec.title) {
      const title = document.getElementById('title')
      title.textContent = spec.title
      seq.push([title, { opacity: [0, 1], y: [6, 0] }, { duration: 0.45, at: 0 }])
      time.t = 0.25
    }

    // Grupos (subgraphs)
    for (const group of spec.groups || []) {
      const g = el('g', { class: 'group' }, groupLayer)
      el('rect', { x: group.x, y: group.y, width: group.w, height: group.h, rx: 22 }, g)
      const t = el('text', { x: group.x + 22, y: group.y + 30, class: 'group-label' }, g)
      t.textContent = group.label
      seq.push([g, { opacity: [0, 1], scale: [0.985, 1] }, { duration: 0.5, at: at(0) }])
      time.t += 0.2
    }

    // Nós, na ordem da especificação
    const nodeEls = {}
    for (const node of spec.nodes || []) {
      const g = drawNode(nodeLayer, node)
      g.style.transformOrigin = `${node.x + node.w / 2}px ${node.y + node.h / 2}px`
      nodeEls[node.id] = g
      seq.push([g, { opacity: [0, 1], scale: [0.92, 1] }, { duration: 0.42, at: at(0), ease: [0.2, 0.8, 0.2, 1] }])
      time.t += spec.nodeStagger ?? 0.12
    }

    // Arestas: o traço é "desenhado" e o rótulo aparece no fim
    const edgeEls = {}
    time.t += 0.1
    for (const edge of spec.edges || []) {
      const a = nodes[edge.from]
      const b = nodes[edge.to]
      const d = edgePath(a, b, edge)
      const cls = `edge ${edge.tone || ''} ${edge.dashed ? 'dashed' : ''}`
      const path = el('path', { d, class: cls }, edgeLayer)
      const length = path.getTotalLength()
      const head = arrowHead(edgeLayer, path, edge.tone)
      path.setAttribute('stroke-dasharray', `${length} ${length}`)
      path.setAttribute('stroke-dashoffset', `${length}`)
      edgeEls[edge.id || `${edge.from}-${edge.to}`] = { path, d, length }
      const dur = Math.min(0.7, 0.25 + length / 900)
      seq.push([path, { strokeDashoffset: [length, 0] }, { duration: dur, at: at(0), ease: 'easeInOut' }])
      seq.push([head, { opacity: [0, 1] }, { duration: 0.12, at: at(dur - 0.08) }])
      if (edge.dashed) {
        // Depois de desenhado, volta ao tracejado.
        seq.push([path, { strokeDasharray: [`${length} ${length}`, '6 6'] }, { duration: 0.01, at: at(dur) }])
      }
      if (edge.label) {
        const label = drawEdgeLabel(labelLayer, path, edge.label, edge.labelAt)
        seq.push([label, { opacity: [0, 1] }, { duration: 0.3, at: at(dur * 0.7) }])
      }
      time.t += spec.edgeStagger ?? 0.14
    }

    // Mensagens de diagrama de sequência
    if (spec.messages) buildMessages(spec, svg, seq, time)

    // Pulsos: bolinhas que percorrem os caminhos em loop, mostrando o fluxo
    const loopStart = time.t + 0.4
    const cycle = spec.cycle ?? 2.6
    const loops = spec.loops ?? 2
    for (const flow of spec.flows || []) {
      for (let loop = 0; loop < loops; loop++) {
        let offset = loopStart + loop * cycle + (flow.delay || 0)
        for (const id of flow.path) {
          const edge = edgeEls[id]
          if (!edge) throw new Error(`Aresta desconhecida no fluxo: ${id}`)
          const dot = document.createElement('div')
          dot.className = `pulse ${flow.tone || ''}`
          dot.style.offsetPath = `path('${edge.d}')`
          pulseLayer.appendChild(dot)
          const dur = Math.max(0.35, edge.length / 520)
          seq.push([dot, { offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }, { duration: dur, at: offset, ease: 'easeInOut' }])
          if (flow.highlight !== false) {
            const target = nodeEls[(spec.edges.find((e) => (e.id || `${e.from}-${e.to}`) === id) || {}).to]
            if (target) seq.push([target, { scale: [1, 1.045, 1] }, { duration: 0.35, at: offset + dur - 0.05 }])
          }
          offset += dur - 0.05
        }
      }
    }

    const end = Math.max(time.t, loopStart + loops * cycle) + (spec.hold ?? 0.6)
    // Um "ponto final" invisível fixa a duração total da timeline.
    const sentinel = document.createElement('i')
    stage.appendChild(sentinel)
    seq.push([sentinel, { opacity: [0, 0] }, { duration: 0.01, at: end - 0.01 }])

    const controls = animate(seq)
    controls.pause()
    controls.time = 0
    window.diagram = {
      duration: end,
      seek(t) {
        controls.time = Math.min(t, end - 0.001)
      },
      play() {
        controls.time = 0
        controls.play()
        controls.then(() => setTimeout(() => window.diagram.play(), 800))
      },
    }
    document.documentElement.dataset.ready = 'true'
  }

  /** Diagrama de sequência: participantes no topo, linhas de vida e mensagens em ordem. */
  function buildMessages(spec, svg, seq, time) {
    const layer = el('g', {}, svg)
    const lifelines = el('g', {}, svg)
    svg.insertBefore(lifelines, svg.firstChild.nextSibling)
    const cols = {}
    const top = spec.participantsTop ?? 70
    const pw = spec.participantWidth ?? 170
    spec.participants.forEach((p, i) => {
      const cx = spec.marginX + i * spec.gapX
      cols[p.id] = cx
      const node = { id: p.id, x: cx - pw / 2, y: top, w: pw, h: 54, label: p.label, sub: p.sub, kind: p.kind }
      const g = drawNode(layer, node)
      g.style.transformOrigin = `${cx}px ${top + 27}px`
      seq.push([g, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.4, at: time.t }])
      const line = el('line', { x1: cx, y1: top + 54, x2: cx, y2: spec.height - 30, class: 'lifeline' }, lifelines)
      const len = spec.height - 30 - (top + 54)
      line.setAttribute('stroke-dasharray', `${len} ${len}`)
      line.setAttribute('stroke-dashoffset', `${len}`)
      seq.push([line, { strokeDashoffset: [len, 0] }, { duration: 0.6, at: time.t + 0.2 }])
      seq.push([line, { strokeDasharray: [`${len} ${len}`, '4 6'] }, { duration: 0.01, at: time.t + 0.85 }])
      time.t += 0.12
    })
    time.t += 0.5
    const pulses = document.querySelector('.pulses')
    spec.messages.forEach((m, i) => {
      const y = spec.firstMessageY + i * spec.messageGap
      const x1 = cols[m.from]
      const x2 = cols[m.to]
      const dir = Math.sign(x2 - x1)
      const d = `M ${x1 + dir * 6} ${y} L ${x2 - dir * 8} ${y}`
      const path = el('path', { d, class: `edge ${m.reply ? 'dashed muted' : 'accent'}` }, layer)
      const len = path.getTotalLength()
      const head = arrowHead(layer, path, m.reply ? 'muted' : 'accent')
      seq.push([head, { opacity: [0, 1] }, { duration: 0.1, at: time.t + 0.4 }])
      path.setAttribute('stroke-dasharray', `${len} ${len}`)
      path.setAttribute('stroke-dashoffset', `${len}`)
      seq.push([path, { strokeDashoffset: [len, 0] }, { duration: 0.45, at: time.t, ease: 'easeInOut' }])
      if (m.reply) seq.push([path, { strokeDasharray: [`${len} ${len}`, '6 5'] }, { duration: 0.01, at: time.t + 0.46 }])
      const t = el('text', { x: (x1 + x2) / 2, y: y - 10, class: 'message' }, layer)
      t.textContent = m.label
      seq.push([t, { opacity: [0, 1], y: [4, 0] }, { duration: 0.3, at: time.t + 0.15 }])
      const dot = document.createElement('div')
      dot.className = `pulse ${m.reply ? 'muted' : ''}`
      dot.style.offsetPath = `path('${d}')`
      pulses.appendChild(dot)
      seq.push([dot, { offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }, { duration: 0.5, at: time.t, ease: 'easeInOut' }])
      time.t += spec.messageStagger ?? 0.55
    })
  }

  const name = new URLSearchParams(location.search).get('d') || 'arquitetura'
  const spec = window.DIAGRAMS[name]
  if (!spec) throw new Error(`Diagrama desconhecido: ${name}`)
  document.title = spec.title
  document.fonts.ready.then(() => {
    build(spec)
    if (!navigator.webdriver) window.diagram.play()
  })
})()

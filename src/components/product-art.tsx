import { Product, Template, productById } from "@/lib/catalog";

export function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const c = product.color;
  return (
    <svg
      className={className}
      viewBox="0 0 180 118"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="92" cy="103" rx="58" ry="6" fill="#252a20" opacity=".07" />
      {product.slot === "desk" && (
        <>
          <path
            d="M40 47v45l5 2V49M131 42v44l5 2V42"
            stroke={product.id === "desk-oak" ? "#aaa99d" : "#564234"}
            strokeWidth="6"
          />
          <path
            d="m31 96 26-7m62 3 27-7"
            stroke={product.id === "desk-oak" ? "#c8c7bb" : "#644b39"}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="m22 40 113-17 30 17-116 20z" fill={c} />
          <path d="m22 40 27 17 116-17v6L49 65 22 46z" fill={c} />
          <path d="m49 60 115-19" stroke="#382619" opacity=".25" />
          <path d="m43 39 86-11m-65 19 83-13" stroke="#fff" opacity=".14" />
        </>
      )}
      {product.slot === "chair" && (
        <>
          <path
            d="M89 71v25m0-1-29 9m29-9 28 9m-28-9 3 13"
            stroke="#666b63"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="65"
            y="15"
            width="53"
            height="55"
            rx="14"
            fill={c}
            transform="rotate(7 65 15)"
          />
          {product.id === "chair-ergo" &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M72 ${27 + i * 5}l32 4`}
                stroke="#979c91"
                opacity=".4"
              />
            ))}
          <path d="m57 64 39-5 24 15-45 10-19-10z" fill={c} />
          <path
            d="M57 61V48h12m47 17V52h-10"
            stroke="#50554e"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="104" r="4" fill="#41443f" />
          <circle cx="117" cy="104" r="4" fill="#41443f" />
          <circle cx="92" cy="108" r="4" fill="#41443f" />
        </>
      )}
      {product.slot === "monitor" && (
        <>
          {(product.id === "monitor-dual" ? [20, 88] : [41]).map((x, i) => (
            <g
              key={x}
              transform={`translate(${x} ${product.id === "monitor-dual" ? 12 : 0}) scale(${product.id === "monitor-dual" ? 0.7 : 1})`}
            >
              <path
                d="M47 69v24m-20 4 41-2"
                stroke="#989d96"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect x="0" y="18" width="98" height="61" rx="4" fill={c} />
              <rect
                x="4"
                y="22"
                width="90"
                height="52"
                rx="1"
                fill={i ? "#8a9683" : "#a2ae98"}
              />
              <path d="m4 60 28-21 27 18 35-13v30H4z" fill="#727f68" />
              <path d="m4 68 43-13 28 7 19-7v19H4z" fill="#59664e" />
            </g>
          ))}
        </>
      )}
      {product.slot === "stand" && (
        <>
          <path d="m53 81 22-33 54 9-24 31z" fill="#babdb6" />
          <path d="m45 91 67-4 19 8-69 7z" fill="#d2d3cc" />
          <path d="m74 49 42 4v7l-45-4z" fill="#858a83" />
        </>
      )}
      {product.slot === "keyboard" && (
        <>
          <path d="m29 54 106-11 25 30-111 13z" fill={c} />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 12 }, (_, k) => (
              <rect
                key={`${r}-${k}`}
                x={37 + k * 8 + r * 3}
                y={55 + r * 6 - k * 0.8}
                width="6"
                height="4"
                rx="1"
                fill="#92998c"
              />
            )),
          )}
        </>
      )}
      {product.slot === "mouse" && (
        <>
          <path d="M69 46c11-19 43-10 47 14l5 19c-2 27-53 26-58 3z" fill={c} />
          <path d="m92 45-2 24" stroke="#92998c" strokeWidth="2" />
          <rect x="88" y="50" width="5" height="11" rx="2" fill="#c2c7be" />
        </>
      )}
      {product.slot === "lamp" && (
        <>
          <ellipse cx="93" cy="95" rx="25" ry="6" fill={c} />
          <path d="M93 94V53l-7-18" stroke={c} strokeWidth="4" />
          <path d="M65 38c0-31 41-31 42 0z" fill={c} />
          <ellipse cx="86" cy="38" rx="21" ry="4" fill="#eddba9" />
        </>
      )}
      {product.slot === "plant" && (
        <>
          <path d="m68 74 7 29h32l7-29z" fill="#c1ae90" />
          <ellipse cx="91" cy="74" rx="23" ry="6" fill="#ab9779" />
          <path
            d="M90 77V30m0 29L65 41m26 13 24-24"
            stroke="#697447"
            strokeWidth="3"
          />
          {[
            [76, 38, -40],
            [98, 27, 20],
            [112, 40, 40],
            [74, 58, -60],
            [107, 62, 50],
          ].map(([x, y, a], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="8"
              ry="17"
              fill={i % 2 ? "#748655" : "#4d643f"}
              transform={`rotate(${a} ${x} ${y})`}
            />
          ))}
        </>
      )}
      {product.slot === "rug" && (
        <>
          <path d="m22 65 98-30 43 32-102 34z" fill={c} />
          {Array.from({ length: 10 }, (_, i) => (
            <path
              key={i}
              d={`m${30 + i * 9} ${63 - i * 2.7} 38 29`}
              stroke="#d7c5a3"
              strokeWidth="2"
              opacity=".7"
            />
          ))}
        </>
      )}
      {product.slot === "power" && (
        <>
          <path d="m40 56 89-11 11 23-88 14z" fill="#c2c2b9" />
          <path d="m40 52 89-11 11 23-88 14z" fill={c} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={62 + i * 25} cy={57 - i * 3} r="6" fill="#bbbcb2" />
              <path
                d={`m${60 + i * 25} ${54 - i * 3}v5m4-5v5`}
                stroke="#777e73"
              />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

export function TemplateArt({ template }: { template: Template }) {
  const desk = productById(template.ids.find((id) => id.startsWith("desk")))!;
  const chair = productById(template.ids.find((id) => id.startsWith("chair")))!;
  return (
    <div className={`template-art template-${template.id}`} aria-hidden="true">
      <span className="mini-wall" />
      <span className="mini-floor" />
      <ProductArt product={desk} className="mini-desk" />
      {template.ids.some((id) => id.startsWith("monitor")) && (
        <ProductArt
          product={productById(
            template.ids.find((id) => id.startsWith("monitor")),
          )!}
          className="mini-monitor"
        />
      )}
      <ProductArt product={chair} className="mini-chair" />
      {template.ids.includes("plant") && (
        <ProductArt product={productById("plant")!} className="mini-plant" />
      )}
    </div>
  );
}

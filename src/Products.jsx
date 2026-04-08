import { useState } from 'react';
import styles from './Products.module.css';

function Ic({ children }) {
  return <span className={styles.ic}>{children}</span>;
}

const PANES = {
  sdk: {
    tag: 'Core library',
    name: <><code>@fangorn-network/sdk</code></>,
    desc: 'Publish data encrypted under programmable access conditions. Fields marked encrypted in your schema are gated by gadgets; the access condition is baked into the ciphertext itself. Everything else stays plaintext and queryable via The Graph.',
    pills: ['TypeScript', 'Pinata', 'Storacha', 'Arbitrum Sepolia', 'The Graph'],
    link: { href: 'https://github.com/fangorn-network/fangorn', label: 'GitHub' },
    features: [
      {
        title: 'Field-level encryption',
        desc: <span>Mark a field <Ic>@type: "encrypted"</Ic> and it gets encrypted at publish time. Plaintext fields stay readable in the manifest with no purchase flow.</span>,
      },
      {
        title: 'Schema and agent registry',
        desc: 'Schemas are registered on-chain alongside ERC-8004 agent identities. Any agent can discover your data source by reading the registry, no extra config required.',
      },
      {
        title: 'Pinata and Storacha',
        desc: <span>Ciphertexts pin to Pinata or Storacha. Manifest CIDs commit on-chain. Subsequent uploads merge with the existing manifest unless you set <Ic>overwrite</Ic>.</span>,
      },
      {
        title: 'Live subgraph',
        desc: 'All registry events indexed in real-time. Plaintext envelope fields are queryable via GraphQL. Encrypted fields never leave storage without a valid claim.',
      },
    ],
  },
};

function SdkPane() {
  const p = PANES.sdk;
  return (
    <div className={styles.twoCol}>
      <div className={styles.ppL}>
        <div className={styles.ppTag}>{p.tag}</div>
        <div className={styles.ppName}>{p.name}</div>
        <p className={styles.ppDesc}>{p.desc}</p>
        <div className={styles.pills}>{p.pills.map(pl => <span key={pl} className={styles.pill}>{pl}</span>)}</div>
        <a href={p.link.href} className={styles.ppLink}>{p.link.label}</a>
      </div>
      <div className={styles.ppR}>
        <div className={styles.featList}>
          {p.features.map(f => (
            <div key={f.title} className={styles.feat}>
              <div className={styles.featBullet} />
              <div>
                <div className={styles.featTitle}>{f.title}</div>
                <p className={styles.featDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function X402Pane() {
  return (
    <div>
      <div className={styles.phases}>
        {[
          { step: '01 / Purchase', title: 'Pay and join the group', desc: 'The buyer sends a signed ERC-3009 transfer and commits a Semaphore identity. The facilitator registers them in the on-chain group for that resource. No linkage between buyer and resource.' },
          { step: '02 / Claim', title: 'Prove membership', desc: 'The buyer generates a Groth16 ZK proof of group membership. The facilitator submits it on-chain and returns a nullifier. The proof reveals nothing about who the buyer is.' },
          { step: '03 / Decrypt', title: 'Unlock locally', desc: 'The buyer uses the nullifier and a stealth key to decrypt locally. The facilitator never holds plaintext. If the server goes offline after phase one, the buyer still has the ciphertext from IPFS.' },
        ].map(ph => (
          <div key={ph.step} className={styles.phase}>
            <div className={styles.phStep}>{ph.step}</div>
            <div className={styles.phTitle}>{ph.title}</div>
            <p className={styles.phDesc}>{ph.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.x402Bottom}>
        <div className={styles.x402Prose}>
          <h3 className={styles.x402H3}>The facilitator cannot withhold data</h3>
          <p className={styles.x402P}>x402f extends HTTP 402 with a register/claim model backed by Semaphore ZK proofs. The facilitator executes settlement on-chain but cannot read plaintext, forge identities, or manipulate proofs.</p>
          <h3 className={styles.x402H3}>Private purchases by default</h3>
          <p className={styles.x402P}>No on-chain linkage between a buyer's wallet and the resource accessed. Sellers get verifiable, programmable access conditions. No custom infrastructure required on either side.</p>
          <a href="https://github.com/fangorn-network/x402f" className={styles.ppLink}>x402f on GitHub</a>
        </div>
        <div className={styles.x402Code}>
          <div className={styles.x402Label}>@fangorn-network/fetch</div>
          <pre className={styles.x402Pre}>{`import { FangornX402Middleware } from '@fangorn-network/fetch';
import { FangornConfig } from '@fangorn-network/sdk';

const middleware = await FangornX402Middleware.create({
  privateKey,
  config:              FangornConfig.ArbitrumSepolia,
  usdcContractAddress: '0x75faf114eafb1...',
  usdcDomainName:      'USD Coin',
  facilitatorAddress:  '0x147c24c5Ea2f1...',
  domain:              'localhost:3000',
});

const result = await middleware.fetchResource({
  privateKey,
  owner:      ownerAddress,
  schemaName: 'fangorn.music.v0',
  tag:        'track1',
  baseUrl:    resourceServerUrl,
});

if (result.success) {
  console.log('decrypted:', result);
}`}</pre>
        </div>
      </div>
    </div>
  );
}

function AgentPane() {
  return (
    <div>
      <div className={styles.agentTop}>
        <div className={styles.agentIntro}>
          <div className={styles.ppTag}>fangorn-agent</div>
          <div className={styles.ppName}>Fangorn Agent</div>
          <p className={styles.ppDesc}>A local agent for discovering and purchasing encrypted data. Runs on your hardware with Ollama or Claude. Tell it to buy a file — it handles the full x402f flow autonomously.</p>
          <div className={styles.pills} style={{ marginBottom: 28 }}>
            {['LangChain', 'Ollama', 'Claude', 'MCP', 'TypeScript', 'Docker'].map(p => <span key={p} className={styles.pill}>{p}</span>)}
          </div>
          <a href="https://github.com/fangorn-network/fangorn-agent" className={styles.ppLink}>GitHub</a>
        </div>
        <div className={styles.agentTerm}>
          <div className={styles.termMock}>
            <div className={styles.termBar}>
              <div className={styles.dot} style={{ background: '#ff5f56' }} />
              <div className={styles.dot} style={{ background: '#ffbd2e', marginLeft: 5 }} />
              <div className={styles.dot} style={{ background: '#27c93f', marginLeft: 5 }} />
              <span className={styles.termLabel}>fangorn explorer</span>
            </div>
            <div className={styles.termBody}>
              <div><span className={styles.tU}>you &gt;</span> <span className={styles.tC}>find music schemas with encrypted audio</span></div>
              <div style={{ height: 6 }} />
              <div><span className={styles.tA}>agent</span> <span className={styles.tD}>querying subgraph...</span></div>
              <div><span className={styles.tD}>&nbsp;&nbsp;schema</span> <span className={styles.tBl}>music.track.v1</span> <span className={styles.tD}>owner 0x3f9a...</span></div>
              <div><span className={styles.tD}>&nbsp;&nbsp;schema</span> <span className={styles.tBl}>pl-genesis.fangorn.music</span> <span className={styles.tD}>owner 0x7c2b...</span></div>
              <div><span className={styles.tD}>&nbsp;&nbsp;29 schemas, 2 unique owners</span></div>
              <div style={{ height: 6 }} />
              <div><span className={styles.tU}>you &gt;</span> <span className={styles.tC}>buy track1 from music.track.v1</span></div>
              <div style={{ height: 6 }} />
              <div><span className={styles.tA}>agent</span> <span className={styles.tD}>loading fangorn toolbox...</span></div>
              <div><span className={styles.tOk}>ok</span>&nbsp;&nbsp;<span className={styles.tD}>phase 1&nbsp;&nbsp;payment sent, joined group</span></div>
              <div><span className={styles.tOk}>ok</span>&nbsp;&nbsp;<span className={styles.tD}>phase 2&nbsp;&nbsp;groth16 proof generated</span></div>
              <div><span className={styles.tOk}>ok</span>&nbsp;&nbsp;<span className={styles.tD}>phase 3&nbsp;&nbsp;decrypted → track1.mp3</span></div>
              <div style={{ height: 6 }} />
              <div><span className={styles.tA}>agent</span> <span className={styles.tC}>done.</span><span className={styles.cursor} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.agentFeats}>
        {[
          { n: '01', title: 'Natural language discovery', desc: 'The Fangorn Explorer queries Graph subgraphs via natural language. The agent reads schema field names and infers data structure without any configuration.' },
          { n: '02', title: 'One instruction to purchase', desc: <span>Tell the agent to buy a file. It handles payment, ZK proof generation, and local decryption end to end. <Ic>fangornFetch</Ic> wraps the entire x402f flow into a single agent call.</span> },
          { n: '03', title: 'Toolbox architecture for small models', desc: <span>Tools lazy-load to avoid overwhelming smaller models. The agent hotswaps tool sets mid-conversation using LangChain's <Ic>bindTools</Ic>, rebinding only what's needed.</span> },
          { n: '04', title: 'Runs on your hardware', desc: 'Designed for consumer GPUs with Ollama. qwen3.5:9b and qwen3.5:4b both reliably execute the full tool flow. Use Claude for MCP-heavy interactions.' },
        ].map(f => (
          <div key={f.n} className={styles.af}>
            <div className={styles.afN}>{f.n}</div>
            <div className={styles.afTitle}>{f.title}</div>
            <p className={styles.afDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MusicPane() {
  const [preview, setPreview] = useState(false);

  const stats = [
    ['Schema registration', 'music.track.v1'],
    ['Encrypted fields', 'audio, lyrics'],
    ['Storage', 'Pinata'],
    ['Payment', 'x402f / USDC'],
    ['Discovery', 'Fangorn Agent + The Graph'],
    ['Network', 'Arbitrum Sepolia'],
  ];

  return (
    <div className={styles.musicInner}>
      <div className={styles.musicL}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.ppTag}>Reference app</div>
          <button
            onClick={() => setPreview(p => !p)}
            className={styles.pill}
            style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--line2)', marginBottom: 18 }}
          >
            {preview ? 'coming soon' : 'preview'}
          </button>
        </div>
        <div className={styles.ppName}>fangorn.music</div>
        {preview ? (
          <>
            <p className={styles.ppDesc}>A live music data application and the canonical end-to-end reference implementation. Every integration point covered: schema registration, encrypted publishing, x402f payment, and agentic discovery.</p>
            <div className={styles.pills} style={{ marginBottom: 28 }}>
              {['Live on Arbitrum Sepolia', 'x402f', 'Fangorn Agent', 'Open template'].map(p => <span key={p} className={styles.pill}>{p}</span>)}
            </div>
            <a href="https://fangorn.music" className={styles.ppLink} style={{ marginRight: 20 }}>fangorn.music</a>
            <a href="https://github.com/fangorn-network" className={styles.ppLink}>GitHub</a>
          </>
        ) : (
          <>
            <p className={styles.ppDesc}>The reference implementation for the full Fangorn stack. Launching soon.</p>
            <div className={styles.pills} style={{ marginBottom: 28 }}>
              <span className={styles.pill}>Coming soon</span>
            </div>
          </>
        )}
      </div>
      <div className={styles.musicR}>
        {preview ? (
          <>
            <div className={styles.musicLabel}>What it covers</div>
            {stats.map(([label, val]) => (
              <div key={label} className={styles.musicStat}>
                <span className={styles.msLabel}>{label}</span>
                <span className={styles.msVal}>{val}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={styles.musicLabel}>fangorn.music</div>
            <p className={styles.ppDesc} style={{ maxWidth: 360 }}>
              A live music data application built entirely on the Fangorn stack. When it ships, every track will be a working demo of field-level encryption, x402f payments, and agentic discovery.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'sdk', label: 'SDK' },
  { id: 'x402f', label: 'x402f' },
  { id: 'agent', label: 'Fangorn Agent' },
  { id: 'music', label: 'fangorn.music' },
];

export default function Products() {
  const [active, setActive] = useState('sdk');

  return (
    <section className={styles.section} id="products">
      <div className={styles.header}>
        <div>
          <h2 className={styles.h2}>Your data shouldn't need a platform's permission to exist.</h2>
          <p className={styles.headerP}>Encrypted storage, private payments, agent-native discovery, and a live reference app. Each piece ships independently.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <a href="https://github.com/fangorn-network" className={styles.ppLink} style={{ fontSize: 12 }}>All repos on GitHub</a>
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.pane}>
        {active === 'sdk' && <SdkPane />}
        {active === 'x402f' && <X402Pane />}
        {active === 'agent' && <AgentPane />}
        {active === 'music' && <MusicPane />}
      </div>
    </section>
  );
}
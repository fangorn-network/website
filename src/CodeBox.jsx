import { useState } from 'react';
import styles from './CodeBox.module.css';

const TABS = ['publish', 'consume', 'schema'];

const CODE = {
  publish: (
    <pre>
      <Line n={1}><Kw>import</Kw> <Op>{'{'}</Op> <Fn>Fangorn</Fn><Op>,</Op> <Fn>FangornConfig</Fn> <Op>{'}'}</Op> <Kw>from</Kw> <Str>'@fangorn-network/sdk'</Str><Op>;</Op></Line>
      <Line n={2}><Kw>import</Kw> <Op>{'{'}</Op> <Fn>SettledGadget</Fn> <Op>{'}'}</Op> <Kw>from</Kw> <Str>'@fangorn-network/sdk/gadgets'</Str><Op>;</Op></Line>
      <Line n={3} />
      <Line n={4}><Kw>const</Kw> <Fn>MUSIC_SCHEMA</Fn><Op>:</Op> <Fn>SchemaDefinition</Fn> <Op>=</Op> <Op>{'{'}</Op></Line>
      <Line n={5}>&nbsp;&nbsp;<Prop>title</Prop><Op>:</Op> <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'string'</Str> <Op>{'}'}</Op><Op>,</Op></Line>
      <Line n={6}>&nbsp;&nbsp;<Prop>artist</Prop><Op>:</Op> <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'string'</Str> <Op>{'}'}</Op><Op>,</Op></Line>
      <Line n={7}>&nbsp;&nbsp;<Prop>audio</Prop><Op>:</Op> <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'encrypted'</Str><Op>,</Op> <Prop>gadget</Prop><Op>:</Op> <Str>'settled'</Str> <Op>{'}'}</Op></Line>
      <Line n={8}><Op>{'}'}</Op><Op>;</Op></Line>
      <Line n={9} />
      <Line n={10}><Kw>const</Kw> <Fn>fangorn</Fn> <Op>=</Op> <Kw>await</Kw> <Fn>Fangorn</Fn><Op>.</Op><Fn>create</Fn><Op>{'({'}</Op></Line>
      <Line n={11}>&nbsp;&nbsp;<Prop>privateKey</Prop><Op>:</Op> <Str>'0x...'</Str><Op>,</Op></Line>
      <Line n={12}>&nbsp;&nbsp;<Prop>storage</Prop><Op>:</Op> <Op>{'{'}</Op> <Prop>pinata</Prop><Op>:</Op> <Op>{'{'}</Op> <Prop>jwt</Prop><Op>:</Op> <Str>'...'</Str><Op>,</Op> <Prop>gateway</Prop><Op>:</Op> <Str>'https://...'</Str> <Op>{'}'}</Op> <Op>{'}'}</Op><Op>,</Op></Line>
      <Line n={13}>&nbsp;&nbsp;<Prop>config</Prop><Op>:</Op> <Fn>FangornConfig</Fn><Op>.</Op><Fn>ArbitrumSepolia</Fn><Op>,</Op></Line>
      <Line n={14}><Op>{'}'}</Op><Op>);</Op></Line>
      <Line n={15} />
      <Line n={16}><Kw>await</Kw> <Fn>fangorn</Fn><Op>.</Op><Fn>publisher</Fn><Op>.</Op><Fn>upload</Fn><Op>{'({'}</Op></Line>
      <Line n={17}>&nbsp;&nbsp;<Prop>records</Prop><Op>:</Op> <Op>[{'{'}</Op></Line>
      <Line n={18}>&nbsp;&nbsp;&nbsp;&nbsp;<Prop>tag</Prop><Op>:</Op> <Str>'track-01'</Str><Op>,</Op></Line>
      <Line n={19}>&nbsp;&nbsp;&nbsp;&nbsp;<Prop>fields</Prop><Op>:</Op> <Op>{'{'}</Op></Line>
      <Line n={20}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Prop>title</Prop><Op>:</Op> <Str>'Track One'</Str><Op>,</Op></Line>
      <Line n={21}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Prop>artist</Prop><Op>:</Op> <Str>'Alice'</Str><Op>,</Op></Line>
      <Line n={22}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Prop>audio</Prop><Op>:</Op> <Op>{'{'}</Op> <Prop>data</Prop><Op>:</Op> <Fn>audioBytes</Fn><Op>,</Op> <Prop>fileType</Prop><Op>:</Op> <Str>'audio/mp3'</Str> <Op>{'}'}</Op><Op>,</Op></Line>
      <Line n={23}>&nbsp;&nbsp;&nbsp;&nbsp;<Op>{'}'}</Op><Op>,</Op></Line>
      <Line n={24}>&nbsp;&nbsp;<Op>{'}'}</Op><Op>],</Op></Line>
      <Line n={25}>&nbsp;&nbsp;<Prop>schema</Prop><Op>:</Op> <Fn>MUSIC_SCHEMA</Fn><Op>,</Op></Line>
      <Line n={26}>&nbsp;&nbsp;<Prop>schemaId</Prop><Op>,</Op></Line>
      <Line n={27}><Op>{'}'}</Op><Op>,</Op> <Num>1n</Num><Op>);</Op><Cursor /></Line>
    </pre>
  ),
  consume: (
    <pre>
      <Line n={1}><Kw>import</Kw> <Op>{'{'}</Op> <Fn>FangornX402Middleware</Fn> <Op>{'}'}</Op> <Kw>from</Kw> <Str>'@fangorn-network/fetch'</Str><Op>;</Op></Line>
      <Line n={2}><Kw>import</Kw> <Op>{'{'}</Op> <Fn>FangornConfig</Fn> <Op>{'}'}</Op> <Kw>from</Kw> <Str>'@fangorn-network/sdk'</Str><Op>;</Op></Line>
      <Line n={3} />
      <Line n={4}><Kw>const</Kw> <Fn>middleware</Fn> <Op>=</Op> <Kw>await</Kw> <Fn>FangornX402Middleware</Fn><Op>.</Op><Fn>create</Fn><Op>{'({'}</Op></Line>
      <Line n={5}>&nbsp;&nbsp;<Prop>privateKey</Prop><Op>:</Op> <Str>'0x...'</Str><Op>,</Op></Line>
      <Line n={6}>&nbsp;&nbsp;<Prop>config</Prop><Op>:</Op> <Fn>FangornConfig</Fn><Op>.</Op><Fn>ArbitrumSepolia</Fn><Op>,</Op></Line>
      <Line n={7}>&nbsp;&nbsp;<Prop>usdcContractAddress</Prop><Op>:</Op> <Str>'0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'</Str><Op>,</Op></Line>
      <Line n={8}>&nbsp;&nbsp;<Prop>usdcDomainName</Prop><Op>:</Op> <Str>'USD Coin'</Str><Op>,</Op></Line>
      <Line n={9}>&nbsp;&nbsp;<Prop>facilitatorAddress</Prop><Op>:</Op> <Str>'0x147c24c5Ea2f1EE1ac42AD16820De23bBba45Ef6'</Str><Op>,</Op></Line>
      <Line n={10}>&nbsp;&nbsp;<Prop>domain</Prop><Op>:</Op> <Str>'your-app.com'</Str><Op>,</Op></Line>
      <Line n={11}><Op>{'}'}</Op><Op>);</Op></Line>
      <Line n={12} />
      <Line n={13}><Kw>const</Kw> <Fn>result</Fn> <Op>=</Op> <Kw>await</Kw> <Fn>middleware</Fn><Op>.</Op><Fn>fetchResource</Fn><Op>{'({'}</Op></Line>
      <Line n={14}>&nbsp;&nbsp;<Prop>privateKey</Prop><Op>:</Op> <Str>'0x...'</Str><Op>,</Op></Line>
      <Line n={15}>&nbsp;&nbsp;<Prop>owner</Prop><Op>:</Op> <Str>'0x...'</Str><Op>,</Op></Line>
      <Line n={16}>&nbsp;&nbsp;<Prop>schemaName</Prop><Op>:</Op> <Str>'music.track.v1'</Str><Op>,</Op></Line>
      <Line n={17}>&nbsp;&nbsp;<Prop>tag</Prop><Op>:</Op> <Str>'track-01'</Str><Op>,</Op></Line>
      <Line n={18}>&nbsp;&nbsp;<Prop>baseUrl</Prop><Op>:</Op> <Str>'https://your-resource-server.com'</Str><Op>,</Op></Line>
      <Line n={19}><Op>{'}'}</Op><Op>);</Op></Line>
      <Line n={20} />
      <Line n={21}><Kw>if</Kw> <Op>(</Op><Fn>result</Fn><Op>.</Op><Prop>success</Prop><Op>)</Op> <Op>{'{'}</Op></Line>
      <Line n={22}>&nbsp;&nbsp;<Cm>{'// result.data → Uint8Array, result.dataString → string'}</Cm></Line>
      <Line n={23}>&nbsp;&nbsp;<Fn>console</Fn><Op>.</Op><Fn>log</Fn><Op>(</Op><Fn>result</Fn><Op>.</Op><Prop>dataString</Prop><Op>);</Op></Line>
      <Line n={24}><Op>{'}'}</Op></Line>
    </pre>
  ),
  schema: (
    <pre>
      <Line n={1}><Kw>const</Kw> <Fn>definition</Fn><Op>:</Op> <Fn>SchemaDefinition</Fn> <Op>=</Op> <Op>{'{'}</Op></Line>
      <Line n={2}>&nbsp;&nbsp;<Prop>title</Prop><Op>:</Op>  <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'string'</Str> <Op>{'}'}</Op><Op>,</Op>                        <Cm>{'// plaintext'}</Cm></Line>
      <Line n={3}>&nbsp;&nbsp;<Prop>artist</Prop><Op>:</Op> <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'string'</Str> <Op>{'}'}</Op><Op>,</Op>                        <Cm>{'// plaintext'}</Cm></Line>
      <Line n={4}>&nbsp;&nbsp;<Prop>audio</Prop><Op>:</Op>  <Op>{'{'}</Op> <Str>'@type'</Str><Op>:</Op> <Str>'encrypted'</Str><Op>,</Op> <Prop>gadget</Prop><Op>:</Op> <Str>'settled'</Str> <Op>{'}'}</Op><Op>,</Op>  <Cm>{'// gated'}</Cm></Line>
      <Line n={5}><Op>{'}'}</Op><Op>;</Op></Line>
      <Line n={6} />
      <Line n={7}><Kw>const</Kw> <Op>{'{'}</Op> <Fn>agentId</Fn> <Op>{'}'}</Op> <Op>=</Op> <Kw>await</Kw> <Fn>fangorn</Fn><Op>.</Op><Fn>schema</Fn><Op>.</Op><Fn>registerAgent</Fn><Op>{'({'}</Op></Line>
      <Line n={8}>&nbsp;&nbsp;<Prop>name</Prop><Op>:</Op> <Str>'music.agent.v1'</Str><Op>,</Op></Line>
      <Line n={9}>&nbsp;&nbsp;<Prop>description</Prop><Op>:</Op> <Str>'Music streaming data source'</Str><Op>,</Op></Line>
      <Line n={10}><Op>{'}'}</Op><Op>);</Op></Line>
      <Line n={11}><Kw>const</Kw> <Op>{'{'}</Op> <Fn>schemaId</Fn> <Op>{'}'}</Op> <Op>=</Op> <Kw>await</Kw> <Fn>fangorn</Fn><Op>.</Op><Fn>schema</Fn><Op>.</Op><Fn>register</Fn><Op>{'({'}</Op></Line>
      <Line n={12}>&nbsp;&nbsp;<Prop>name</Prop><Op>:</Op> <Str>'music.track.v1'</Str><Op>,</Op> <Fn>definition</Fn><Op>,</Op> <Fn>agentId</Fn><Op>,</Op></Line>
      <Line n={13}><Op>{'}'}</Op><Op>);</Op><Cursor /></Line>
    </pre>
  ),
};

function Line({ n, children }) {
  return (
    <div className={styles.line}>
      <span className={styles.ln}>{n}</span>
      {children}
    </div>
  );
}
function Kw({ children }) { return <span className={styles.kw}>{children}</span>; }
function Fn({ children }) { return <span className={styles.fn}>{children}</span>; }
function Str({ children }) { return <span className={styles.str}>{children}</span>; }
function Op({ children }) { return <span className={styles.op}>{children}</span>; }
function Cm({ children }) { return <span className={styles.cm}>{children}</span>; }
function Prop({ children }) { return <span className={styles.prop}>{children}</span>; }
function Num({ children }) { return <span className={styles.num}>{children}</span>; }
function Cursor() { return <span className={styles.cursor} />; }

export default function CodeBox() {
  const [active, setActive] = useState('publish');
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.dots}>
          <div className={styles.dot} style={{ background: '#ff5f56' }} />
          <div className={styles.dot} style={{ background: '#ffbd2e' }} />
          <div className={styles.dot} style={{ background: '#27c93f' }} />
        </div>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${active === t ? styles.tabActive : ''}`}
              onClick={() => setActive(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className={styles.copy} onClick={handleCopy}>
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <div className={styles.code}>
        {CODE[active]}
      </div>
    </div>
  );
}

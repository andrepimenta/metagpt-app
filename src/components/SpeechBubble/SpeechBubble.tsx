import styles from './SpeechBubble.module.css';
import Loader from '../../assets/loading.gif';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import fox from '../../assets/fox.svg';
import { useEffect, useState } from 'react';

export const SpeechBubble: React.FC<{
  speaker: string;
  text: string;
  loading?: boolean;
  animate: boolean;
  delay?: number;
  devMode?: boolean;
}> = (props) => {
  let speechBubbleClass: string;
  let containerClass: string;

  if (props.speaker === 'ai') {
    speechBubbleClass = 'ai';
    containerClass = 'ai-container';
  } else {
    speechBubbleClass = 'user';
    containerClass = 'user-container';
  }

  const content = props.loading ? (
    <img src={Loader} width={40} alt="Loading" />
  ) : (
    <ReactMarkdown>{props.text}</ReactMarkdown>
  );

  const getCode = () => {
    try {
      const code = props.text.split('```')[1].split('```')[0].replace('javascript', '').replace('Javascript', '');
      return code;
    } catch (e) {
      return undefined;
    }
  };

  const executeCode = () => {
    const code = getCode();
    eval(code);
  };

  const hasExecutableCode = () => {
    const hasCode = Boolean(getCode());

    return hasCode;
  };

  useEffect(() => {
    if (props.text && props.speaker === 'ai') {
      if (hasExecutableCode() && window.notDev) {
        executeCode();
      }
    }
  }, [props.text, props.speaker]);

  if (props.animate) {
    return (
      <motion.div
        className={styles[containerClass]}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.5, delay: props.delay ? props.delay : 0 }}
      >
        <div className="grow"></div>
        <div className={styles[speechBubbleClass]}>
          <div style={{ overflow: 'scroll' }}>
            {hasExecutableCode() && window.notDev ? 'Check your MetaMask wallet' : content}
          </div>
          {props.speaker === 'ai' && props.text && hasExecutableCode() && (
            <div style={{ justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', flex: 1 }}>
              <button
                style={{
                  backgroundColor: '#0376c9',
                  padding: 10,
                  borderRadius: 12,
                  margin: 10,
                }}
                className="hover:bg-blue-800"
                onClick={executeCode}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ marginRight: 6 }}>
                    <img src={fox} width={30} alt="Loading" />
                  </div>
                  <div>Try it with MetaMask</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  } else {
    return (
      <div className={styles[containerClass]}>
        <div className="grow"></div>
        <div className={styles[speechBubbleClass]}>{content}</div>
      </div>
    );
  }
};

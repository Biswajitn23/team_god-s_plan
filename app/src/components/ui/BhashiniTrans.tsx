import React from 'react';
import { LibreTrans } from './LibreTrans';

interface BhashiniTransProps {
  text: string;
  className?: string;
  isTitle?: boolean;
}

/**
 * Backward compatibility component for BhashiniTrans
 * Seamlessly routes all translations through Sarvam AI via LibreTrans
 */
export const BhashiniTrans: React.FC<BhashiniTransProps> = (props) => {
  return <LibreTrans {...props} />;
};

export default BhashiniTrans;

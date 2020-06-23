import React from 'react';

import bemHelper from '../../utils/bemUtils';

import './box.less';

type BoxMargin = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'none';

interface BoxProps {
    margin?: BoxMargin;
    padBottom?: BoxMargin;
    textAlignCenter?: boolean;
    className?: string;
    children: React.ReactNode;
}

const bem = bemHelper('box');

const Box = ({ margin, padBottom, className, textAlignCenter, children }: BoxProps) => {
    const classNames = bem.classNames(
        bem.block,
        bem.modifierConditional(margin, margin !== undefined),
        bem.modifierConditional(`bottom-${padBottom}`, padBottom !== undefined),
        {
            [bem.modifier('textAlignCenter')]: textAlignCenter,
            [`${className}`]: className !== undefined,
        }
    );
    return <div className={classNames}>{children}</div>;
};

export default Box;

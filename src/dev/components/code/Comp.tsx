import React from 'react';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import Code from './Code';

interface Props {
    title: string;
    actions?: string;
    isFormik?: boolean;
    isLayout?: boolean;
    children: React.ReactNode;
}

const Comp = ({ title, children, actions, isFormik, isLayout }: Props) => (
    <div>
        <Code
            isFormik={isFormik}
            isLayout={isLayout}
            style={{
                marginBottom: '0px',
                marginLeft: '.125rem',
                borderTopLeftRadius: '.25rem',
                borderTopRightRadius: '.25rem',
            }}>
            {title}
        </Code>
        <Panel border={true} style={{ padding: '1rem  1rem 1rem 1rem' }}>
            {children}
            {actions && (
                <Panel
                    style={{
                        margin: '1rem -1rem -1rem -1rem',
                        padding: '.5rem 1rem',
                        borderTop: '1px dashed #B7B1A9',
                    }}>
                    <Element tag="span">Actions:{` `}</Element>
                    <Code style={{ display: 'inline-block', margin: 'none' }} isFormik={isFormik} isLayout={isLayout}>
                        {actions}
                    </Code>
                </Panel>
            )}
        </Panel>
    </div>
);

export default Comp;

import BlockContent from '@sanity/block-content-to-react';
import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import { BlockContentType } from '../../types';

interface Props {
    content: BlockContentType;
}

const ListItemRenderer = (props: { children: React.ReactNode; node: { style: string } }) => {
    return <li className={props.node.style}>{props.children}</li>;
};

const BlockRenderer = (props: { children: React.ReactNode; node: { style: string } }) => {
    if (props.node.style === 'title') {
        return (
            <div style={{ marginBottom: '.5rem', paddingTop: '1rem' }}>
                <Undertittel>{props.children}</Undertittel>
            </div>
        );
    }
    return <p>{props.children}</p>;
};
const LinkRenderer = (props: {
    children: React.ReactNode;
    mark: {
        href: string;
    };
}) => {
    return <Lenke href={props.mark.href}>{props.children}</Lenke>;
};

const SanityBlock: React.FunctionComponent<Props> = ({ content }) => {
    return (
        <BlockContent
            blocks={content}
            serializers={{
                listItem: ListItemRenderer,
                marks: {
                    link: LinkRenderer,
                },
                block: BlockRenderer,
            }}
        />
    );
};
export default SanityBlock;

import React from 'react';

interface Props {
    children: React.ReactNode;
}

const Question = (props: Props) => <div style={{ marginBottom: '2rem' }}>{props.children}</div>;

export default Question;

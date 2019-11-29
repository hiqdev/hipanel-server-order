import styled from 'styled-components'

const ServerOrderWrapper = styled.div.attrs(props => ({className: 'use-bootstrap'}))`
  padding: 20px 0;
  background-color: ${props => props.configId !== null ? "white" : "white"};
  height: auto;
`;

export default ServerOrderWrapper;
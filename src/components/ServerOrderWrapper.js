import styled from 'styled-components'

const ServerOrderWrapper = styled.div`
  padding: 20px 0;
  background-color: ${props => props.configId !== null ? "white" : "white"};
  height: 100%;
`;

export default ServerOrderWrapper;
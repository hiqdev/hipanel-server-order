import styled from 'styled-components'

const ServerOrderWrapper = styled.div`
  padding-top: 108px;
  background-color: ${props => props.configId !== null ? "#fcf9f7" : "white"};
  height: 100vh;
  font-family: 'Open Sans', sans-serif;
`;

export default ServerOrderWrapper;
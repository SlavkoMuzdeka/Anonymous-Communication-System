import React from "react";
import { Input, Space } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledInput = styled(Input.Search)`
  width: 325px;
  margin: 3px;
`;

const Searchbar = ({ onSearch }) => {
  return (
    <Space direction="vertical">
      <StyledInput placeholder="Find a user" onChange={onSearch} />
    </Space>
  );
};

Searchbar.propTypes = {
  onSearch: PropTypes.func,
};

export default Searchbar;

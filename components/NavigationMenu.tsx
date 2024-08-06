import FilledNavigation from '@/public/icons/ic_fluent_navigation_24_filled.svg';
import styled from 'styled-components';

export default function NavigationMenu() {
  return <StyledFilledNavigation />;
}

const StyledFilledNavigation = styled(FilledNavigation)`
  width: 30px;
`;

import NavigationIcon from '@/components/NavigationHeader/NavigationIcon';
import UserIcon from '@/public/icons/ic_fluent_person_24_filled.svg';
import styled from 'styled-components';
import Link from 'next/link';
import { HeaderProps } from '@/types';

export default function Header({ onToggleNav }: HeaderProps) {
  return (
    <StyledHeader>
      <NavigationIcon onToggleNav={onToggleNav} />
      <Link href='/'>
        <StyledAppTitle>meaLove</StyledAppTitle>
      </Link>
      <Link href='/login'>
        <StyledUserIcon />
      </Link>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  background-color: var(--color-primary-1);
  color: var(--color-neutral-1);
  min-height: var(--spacing-10);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding-inline: var(--spacing-5);
  margin-bottom: var(--spacing-1);
`;

const StyledAppTitle = styled.h2`
  font: var(--font-nav);
  letter-spacing: var(--letter-spacing-s);
`;

const StyledUserIcon = styled(UserIcon)`
  height: 25px;
  width: 25px;
  fill: var(--color-neutral-1);
  justify-self: flex-end;
  outline: 2px solid var(--color-neutral-1);
  border-radius: 50%;
`;

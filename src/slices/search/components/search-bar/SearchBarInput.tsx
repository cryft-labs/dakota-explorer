// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Input } from 'src/toolkit/chakra/input';
import { InputGroup } from 'src/toolkit/chakra/input-group';
import { ClearButton } from 'src/toolkit/components/buttons/ClearButton';

const nameServicesFeature = config.features.nameServices;

interface Props extends Omit<HTMLChakraProps<'form'>, 'onChange'> {
  onChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear?: () => void;
  onFormClick?: (event: React.MouseEvent<HTMLFormElement>) => void;
  isHeroBanner?: boolean;
  isSuggestOpen?: boolean;
  value?: string;
  readOnly?: boolean;
}

const SearchBarInput = (
  { onChange, onSubmit, isHeroBanner, isSuggestOpen, onFocus, onBlur, onHide, onClear, onFormClick, value, readOnly, ...rest }: Props,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const innerRef = React.useRef<HTMLFormElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLFormElement, []);
  const isMobile = useIsMobile();

  const borderWidthHeroBanner = useColorModeValue(
    config.slices.home.heroBanner?.search?.border_width?.[0] ?? '0px',
    config.slices.home.heroBanner?.search?.border_width?.[1] ?? '0px',
  );

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  }, [ onChange ]);

  const handleFormKeyDown = React.useCallback((event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }, []);

  const handleKeyPress = React.useCallback((event: globalThis.KeyboardEvent) => {
    if (isMobile) {
      return;
    }

    switch (event.key) {
      case '/': {
        if ([ 'INPUT', 'TEXTAREA' ].includes((event.target as HTMLElement).tagName)) {
          break;
        }

        if (!isSuggestOpen) {
          event.preventDefault();
          innerRef.current?.querySelector('input')?.focus();
          onFocus?.();
        }
        break;
      }
      case 'Escape': {
        if (isSuggestOpen) {
          innerRef.current?.querySelector('input')?.blur();
          onHide?.();
        }
        break;
      }
    }
  }, [ isMobile, isSuggestOpen, onFocus, onHide ]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ handleKeyPress ]);

  const getPlaceholder = () => {
    const clusterText = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? ' / cluster' : '';
    return `Search by address / txn hash / block / token / CID${ clusterText }/... `;
  };

  const startElement = (
    <SpriteIcon
      name="search"
      boxSize={ 5 }
      mx={ 2 }
    />
  );

  const endElement = (
    <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } mx={ 2 }/>
  );

  return (
    <chakra.form
      ref={ innerRef }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      onClick={ onFormClick }
      onKeyDown={ handleFormKeyDown }
      w="100%"
      backgroundColor="bg.primary"
      borderRadius="base"
      position="relative"
      zIndex={ isSuggestOpen ? 'modal' : 'auto' }
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        endElement={ endElement }
      >
        <Input
          size={{ base: isHeroBanner ? 'md' : 'sm', lg: 'md' }}
          placeholder={ getPlaceholder() }
          value={ value }
          onChange={ handleChange }
          onFocus={ onFocus }
          readOnly={ readOnly }
          tabIndex={ readOnly ? -1 : 0 }
          borderWidth={ isHeroBanner ? borderWidthHeroBanner : '2px' }
          borderStyle="solid"
          borderColor={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.200' }}
          color={{ _light: 'black', _dark: 'white' }}
          backgroundColor={{ base: isHeroBanner ? 'input.bg' : 'dialog.bg', lg: 'input.bg' }}
          _hover={{ borderColor: 'input.border.hover' }}
          _focusWithin={{ _placeholder: { color: 'gray.300' }, borderColor: 'input.border.focus', _hover: { borderColor: 'input.border.focus' } }}
          enterKeyHint="search"
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));

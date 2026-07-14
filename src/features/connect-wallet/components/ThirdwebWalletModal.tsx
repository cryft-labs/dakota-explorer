// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Input, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from 'thirdweb/react';
import type { Wallet } from 'thirdweb/wallets';
import { createWallet, getWalletInfo } from 'thirdweb/wallets';
import { getProfiles, getSocialIcon, preAuthenticate } from 'thirdweb/wallets/in-app';

import AddressIdenticon from 'src/slices/address/components/icon/AddressIdenticon';

import {
  thirdwebChain,
  thirdwebClient,
  thirdwebInAppWallet,
} from 'src/features/connect-wallet/utils/thirdweb-config';

import DakotaStarfield from 'src/shared/components/DakotaStarfield';
import getErrorMessage from 'src/shared/errors/get-error-message';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from 'src/toolkit/chakra/dialog';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Image } from 'src/toolkit/chakra/image';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type ModalView = 'connect' | 'account' | null;

interface ModalContextValue {
  isOpen: boolean;
  openConnect: () => Promise<Wallet | undefined>;
  openAccount: () => void;
}

const ThirdwebWalletModalContext = React.createContext<ModalContextValue | null>(null);

export const useThirdwebWalletModal = () => {
  const value = React.useContext(ThirdwebWalletModalContext);

  if (!value) {
    throw new Error('ThirdwebWalletModalProvider is missing');
  }

  return value;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const ThirdwebWalletModalProvider = ({ children }: ProviderProps) => {
  const [ view, setView ] = React.useState<ModalView>(null);
  const connectResolver = React.useRef<((wallet: Wallet | undefined) => void) | null>(null);

  const close = React.useCallback(() => {
    setView(null);
    connectResolver.current?.(undefined);
    connectResolver.current = null;
  }, []);

  const openConnect = React.useCallback(() => {
    connectResolver.current?.(undefined);
    setView('connect');

    return new Promise<Wallet | undefined>((resolve) => {
      connectResolver.current = resolve;
    });
  }, []);

  const openAccount = React.useCallback(() => {
    connectResolver.current?.(undefined);
    connectResolver.current = null;
    setView('account');
  }, []);

  const completeConnection = React.useCallback((wallet: Wallet) => {
    connectResolver.current?.(wallet);
    connectResolver.current = null;
    setView(null);
  }, []);

  const value = React.useMemo(() => ({
    isOpen: view !== null,
    openAccount,
    openConnect,
  }), [ openAccount, openConnect, view ]);

  return (
    <ThirdwebWalletModalContext.Provider value={ value }>
      { children }
      <ThirdwebWalletModal view={ view } onClose={ close } onConnected={ completeConnection }/>
    </ThirdwebWalletModalContext.Provider>
  );
};

interface ModalProps {
  view: ModalView;
  onClose: () => void;
  onConnected: (wallet: Wallet) => void;
}

type ExternalWalletId = 'io.metamask' | 'com.coinbase.wallet' | 'walletConnect';

const EXTERNAL_WALLETS: Array<{ id: ExternalWalletId; label: string }> = [
  { id: 'io.metamask', label: 'MetaMask' },
  { id: 'com.coinbase.wallet', label: 'Coinbase' },
  { id: 'walletConnect', label: 'WalletConnect' },
];

type WalletProvider = 'google' | 'apple' | ExternalWalletId;

const SOCIAL_ICONS = {
  google: getSocialIcon('google'),
  apple: getSocialIcon('apple'),
};

const walletIconCache = new Map<ExternalWalletId, string>();

const WalletProviderLogo = ({ provider }: { provider: WalletProvider }) => {
  const [ icon, setIcon ] = React.useState(() => {
    if (provider === 'google' || provider === 'apple') {
      return SOCIAL_ICONS[provider];
    }

    return walletIconCache.get(provider);
  });

  React.useEffect(() => {
    if (provider === 'google' || provider === 'apple' || provider === 'com.coinbase.wallet' || icon) {
      return;
    }

    let isActive = true;

    void getWalletInfo(provider, true).then((walletIcon) => {
      walletIconCache.set(provider, walletIcon);
      isActive && setIcon(walletIcon);
    }).catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [ icon, provider ]);

  if (provider === 'com.coinbase.wallet') {
    return (
      <SpriteIcon
        name="wallets/coinbase"
        boxSize="20px"
        flexShrink={ 0 }
        aria-hidden="true"
      />
    );
  }

  if (!icon) {
    return <Box aria-hidden="true" w="20px" h="20px" flexShrink={ 0 }/>;
  }

  return (
    <Image
      src={ icon }
      alt=""
      aria-hidden="true"
      w="20px"
      h="20px"
      objectFit="contain"
      flexShrink={ 0 }
    />
  );
};

interface ExternalWalletButtonProps {
  wallet: { id: ExternalWalletId; label: string };
  pendingAction?: string;
  isBusy: boolean;
  onConnect: (walletId: ExternalWalletId) => void;
}

const ExternalWalletButton = ({ wallet, pendingAction, isBusy, onConnect }: ExternalWalletButtonProps) => {
  const handleClick = React.useCallback(() => {
    onConnect(wallet.id);
  }, [ onConnect, wallet.id ]);

  return (
    <Button
      variant="solid"
      width="full"
      gridColumn={ wallet.id === 'walletConnect' ? '1 / -1' : undefined }
      minH="44px"
      px={{ base: 2, sm: 3 }}
      justifyContent="center"
      onClick={ handleClick }
      loading={ pendingAction === wallet.id }
      disabled={ isBusy && pendingAction !== wallet.id }
    >
      <WalletProviderLogo provider={ wallet.id }/>
      <Text as="span" fontSize="sm" whiteSpace="nowrap">{ wallet.label }</Text>
    </Button>
  );
};

const ThirdwebWalletModal = ({ view, onClose, onConnected }: ModalProps) => {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { connect, isConnecting, cancelConnection } = useConnect();
  const { disconnect } = useDisconnect();

  const [ email, setEmail ] = React.useState('');
  const [ verificationCode, setVerificationCode ] = React.useState('');
  const [ emailStep, setEmailStep ] = React.useState<'email' | 'verify'>('email');
  const [ pendingAction, setPendingAction ] = React.useState<string>();
  const [ error, setError ] = React.useState<string>();
  const [ identityLabel, setIdentityLabel ] = React.useState<string>();
  const [ isCopied, setIsCopied ] = React.useState(false);
  const [ dragOffset, setDragOffset ] = React.useState(0);
  const [ isDragging, setIsDragging ] = React.useState(false);
  const dragStartY = React.useRef(0);
  const dragOffsetRef = React.useRef(0);

  React.useEffect(() => {
    if (view === 'connect') {
      setError(undefined);
      setEmailStep('email');
      setVerificationCode('');
    }
  }, [ view ]);

  React.useEffect(() => {
    if (view !== 'account' || activeWallet?.id !== 'inApp') {
      setIdentityLabel(undefined);
      return;
    }

    let isActive = true;

    void getProfiles({ client: thirdwebClient }).then((profiles) => {
      if (!isActive) {
        return;
      }

      const profile = profiles.find(({ type }) => [ 'google', 'apple', 'email' ].includes(type));
      if (!profile) {
        return;
      }

      const provider = profile.type.charAt(0).toUpperCase() + profile.type.slice(1);
      setIdentityLabel(profile.details.email ? `${ provider } - ${ profile.details.email }` : `${ provider } account`);
    }).catch(() => {
      isActive && setIdentityLabel('Dakota Cards wallet');
    });

    return () => {
      isActive = false;
    };
  }, [ activeWallet?.id, view ]);

  const handleClose = React.useCallback(() => {
    cancelConnection();
    setDragOffset(0);
    setIsDragging(false);
    dragOffsetRef.current = 0;
    onClose();
  }, [ cancelConnection, onClose ]);

  const handleDragStart = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handleDragMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const nextOffset = Math.max(0, event.clientY - dragStartY.current);
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  }, [ isDragging ]);

  const handleDragEnd = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const shouldClose = dragOffsetRef.current >= 96;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);

    if (shouldClose) {
      handleClose();
    }
  }, [ handleClose ]);

  const runConnection = React.useCallback(async(action: string, createConnection: () => Promise<Wallet>) => {
    setPendingAction(action);
    setError(undefined);

    try {
      const wallet = await connect(createConnection);
      wallet && onConnected(wallet);
    } catch (connectError) {
      setError(getErrorMessage(connectError) || 'Unable to connect this wallet. Please try again.');
    } finally {
      setPendingAction(undefined);
    }
  }, [ connect, onConnected ]);

  const handleSocialConnect = React.useCallback((strategy: 'google' | 'apple') => {
    void runConnection(strategy, async() => {
      await thirdwebInAppWallet.connect({ client: thirdwebClient, chain: thirdwebChain, strategy });
      return thirdwebInAppWallet;
    });
  }, [ runConnection ]);

  const handleExternalConnect = React.useCallback((walletId: ExternalWalletId) => {
    void runConnection(walletId, async() => {
      const wallet = createWallet(walletId);
      await wallet.connect({ client: thirdwebClient, chain: thirdwebChain });
      return wallet;
    });
  }, [ runConnection ]);

  const handleSendCode = React.useCallback(async(event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return;
    }

    setPendingAction('email');
    setError(undefined);

    try {
      await preAuthenticate({ client: thirdwebClient, strategy: 'email', email: normalizedEmail });
      setEmailStep('verify');
    } catch (authError) {
      setError(getErrorMessage(authError) || 'Unable to send a verification code. Please try again.');
    } finally {
      setPendingAction(undefined);
    }
  }, [ email ]);

  const handleVerifyEmail = React.useCallback((event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedCode = verificationCode.trim();

    if (!normalizedEmail || !normalizedCode) {
      return;
    }

    void runConnection('email-verify', async() => {
      await thirdwebInAppWallet.connect({
        client: thirdwebClient,
        chain: thirdwebChain,
        strategy: 'email',
        email: normalizedEmail,
        verificationCode: normalizedCode,
      });
      return thirdwebInAppWallet;
    });
  }, [ email, runConnection, verificationCode ]);

  const handleCopyAddress = React.useCallback(async() => {
    if (!activeAccount?.address) {
      return;
    }

    await navigator.clipboard.writeText(activeAccount.address);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  }, [ activeAccount?.address ]);

  const handleDisconnect = React.useCallback(() => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
    onClose();
  }, [ activeWallet, disconnect, onClose ]);

  const walletLabel = (() => {
    if (identityLabel) {
      return identityLabel;
    }

    switch (activeWallet?.id) {
      case 'io.metamask':
        return 'MetaMask';
      case 'com.coinbase.wallet':
        return 'Coinbase';
      case 'walletConnect':
        return 'WalletConnect';
      case 'inApp':
        return 'Dakota Cards wallet';
      default:
        return 'Connected wallet';
    }
  })();

  const isBusy = Boolean(pendingAction) || isConnecting;

  const handleGoogleConnect = React.useCallback(() => {
    handleSocialConnect('google');
  }, [ handleSocialConnect ]);

  const handleAppleConnect = React.useCallback(() => {
    handleSocialConnect('apple');
  }, [ handleSocialConnect ]);

  const handleEmailChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  const handleVerificationCodeChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  }, []);

  const handleUseAnotherEmail = React.useCallback(() => {
    setEmailStep('email');
    setVerificationCode('');
    setError(undefined);
  }, []);

  const connectContent = (
    <Stack gap={{ base: 3, md: 5 }} textAlign="center">
      <Text color="text.secondary" fontSize="sm" lineHeight="tall" textAlign="center">
        Choose how you want to connect to the Dakota Cards Explorer.
      </Text>

      <SimpleGrid columns={ 2 } gap={{ base: 2, md: 3 }}>
        <Button
          variant="solid"
          h="44px"
          justifyContent="center"
          whiteSpace="nowrap"
          onClick={ handleGoogleConnect }
          loading={ pendingAction === 'google' }
          disabled={ isBusy && pendingAction !== 'google' }
        >
          <WalletProviderLogo provider="google"/>
          Google
        </Button>
        <Button
          variant="solid"
          h="44px"
          justifyContent="center"
          whiteSpace="nowrap"
          onClick={ handleAppleConnect }
          loading={ pendingAction === 'apple' }
          disabled={ isBusy && pendingAction !== 'apple' }
        >
          <WalletProviderLogo provider="apple"/>
          Apple
        </Button>
      </SimpleGrid>

      { emailStep === 'email' ? (
        <Box as="form" onSubmit={ handleSendCode } textAlign="center">
          <Flex gap={ 2 } direction="row">
            <Input
              aria-label="Email address"
              type="email"
              value={ email }
              onChange={ handleEmailChange }
              placeholder="you@example.com"
              h="42px"
              minW={ 0 }
              textAlign="center"
              borderColor="border.divider"
              disabled={ isBusy }
              required
            />
            <Button
              type="submit"
              variant="solid"
              h="42px"
              minW={{ base: '118px', sm: '132px' }}
              flexShrink={ 0 }
              justifyContent="center"
              whiteSpace="nowrap"
              loading={ pendingAction === 'email' }
              disabled={ isBusy || !email.trim() }
            >
              <SpriteIcon name="email" boxSize={ 4 }/>
              Send code
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box as="form" onSubmit={ handleVerifyEmail } textAlign="center">
          <Text fontSize="sm" fontWeight={ 700 } textAlign="center">Enter verification code</Text>
          <Text color="text.secondary" fontSize="xs" mt={ 1 } mb={ 3 } textAlign="center">
            We sent a code to { email.trim() }.
          </Text>
          <Flex gap={ 2 } direction="row">
            <Input
              aria-label="Email verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={ verificationCode }
              onChange={ handleVerificationCodeChange }
              placeholder="Verification code"
              h="42px"
              minW={ 0 }
              textAlign="center"
              borderColor="border.divider"
              disabled={ isBusy }
              required
            />
            <Button
              type="submit"
              variant="solid"
              h="42px"
              minW={{ base: '118px', sm: '132px' }}
              flexShrink={ 0 }
              justifyContent="center"
              loading={ pendingAction === 'email-verify' }
              disabled={ isBusy || !verificationCode.trim() }
            >
              Verify
            </Button>
          </Flex>
          <Button
            variant="solid"
            size="sm"
            mt={ 3 }
            onClick={ handleUseAnotherEmail }
            disabled={ isBusy }
          >
            Use another email
          </Button>
        </Box>
      ) }

      <Flex alignItems="center" gap={ 3 }>
        <Box h="1px" flex="1" bg="border.divider"/>
        <Text color="text.secondary" fontSize="xs" fontWeight={ 700 } textTransform="uppercase">
          External wallets
        </Text>
        <Box h="1px" flex="1" bg="border.divider"/>
      </Flex>

      <SimpleGrid columns={ 2 } gap={{ base: 2, md: 3 }}>
        { EXTERNAL_WALLETS.map((wallet) => (
          <ExternalWalletButton
            key={ wallet.id }
            wallet={ wallet }
            pendingAction={ pendingAction }
            isBusy={ isBusy }
            onConnect={ handleExternalConnect }
          />
        )) }
      </SimpleGrid>

      { error && (
        <Box
          role="alert"
          borderWidth="1px"
          borderColor={{ _light: 'red.200', _dark: 'red.700' }}
          bg={{ _light: 'red.50', _dark: 'rgba(127, 29, 29, 0.22)' }}
          color={{ _light: 'red.700', _dark: 'red.200' }}
          borderRadius="md"
          px={ 3 }
          py={ 2.5 }
          fontSize="sm"
        >
          { error }
        </Box>
      ) }

      <Text color="text.secondary" fontSize="xs" textAlign="center">
        Your wallet session stays secure. The Dakota Cards Explorer never receives your seed phrase or private key.
      </Text>
    </Stack>
  );

  const accountContent = activeAccount ? (
    <Stack gap={ 5 } textAlign="center">
      <Text color="text.secondary" fontSize="sm" textAlign="center">
        This wallet address is active for Dakota Cards Explorer signatures and contract transactions.
      </Text>

      <Flex
        alignItems="center"
        gap={ 3 }
        borderWidth="1px"
        borderColor="border.divider"
        borderRadius="md"
        px={ 4 }
        py={ 3 }
        bg={{ _light: 'rgba(240, 253, 250, 0.72)', _dark: 'rgba(16, 55, 47, 0.54)' }}
      >
        <AddressIdenticon size={ 42 } hash={ activeAccount.address }/>
        <Box minW={ 0 } flex="1">
          <Text fontSize="xs" color="text.secondary" mb={ 1 }>{ walletLabel }</Text>
          <Text
            fontFamily="mono"
            fontSize="sm"
            fontWeight={ 700 }
            overflowWrap="anywhere"
          >
            { activeAccount.address }
          </Text>
        </Box>
        <Tooltip content={ isCopied ? 'Copied' : 'Copy address' }>
          <IconButton
            aria-label={ isCopied ? 'Address copied' : 'Copy wallet address' }
            variant="icon_secondary"
            size="md"
            onClick={ handleCopyAddress }
          >
            <SpriteIcon name={ isCopied ? 'copy_check' : 'copy' }/>
          </IconButton>
        </Tooltip>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" gap={ 4 } fontSize="sm">
        <Text color="text.secondary">Network</Text>
        <Text fontWeight={ 700 } textAlign="right">{ activeWallet?.getChain()?.name || thirdwebChain.name }</Text>
      </Flex>

      <Button variant="solid" width="full" onClick={ handleDisconnect }>
        Disconnect wallet
      </Button>
    </Stack>
  ) : connectContent;

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      handleClose();
    }
  }, [ handleClose ]);

  return (
    <DialogRoot
      open={ view !== null }
      onOpenChange={ handleOpenChange }
      placement={{ base: 'bottom', lg: 'center' }}
      motionPreset={{ base: 'slide-in-bottom', lg: 'scale' }}
      closeOnInteractOutside={ !isBusy }
      closeOnEscape={ !isBusy }
      lazyMount
      unmountOnExit
    >
      <DialogContent
        maxW={{ base: 'calc(100vw - 24px)', md: '560px' }}
        maxH={{ base: 'calc(100dvh - 12px)', lg: 'calc(100dvh - 48px)' }}
        mt={{ lg: 0 }}
        mx={{ lg: 0 }}
        mb={{ base: 2, lg: 0 }}
        overflow="hidden"
        position="relative"
        isolation="isolate"
        transform={ dragOffset > 0 ? { base: `translate3d(0, ${ dragOffset }px, 0)`, lg: 'none' } : undefined }
        transition={ isDragging ? 'none' : 'transform 180ms ease-out' }
        bg={{ _light: 'rgba(255, 255, 255, 0.98)', _dark: 'rgba(7, 30, 25, 0.98)' }}
        borderWidth="1px"
        borderColor={{ _light: 'rgba(15, 118, 110, 0.2)', _dark: 'rgba(52, 211, 153, 0.2)' }}
        borderRadius="md"
        boxShadow={{ _light: '0 24px 70px rgba(15, 118, 110, 0.18)', _dark: '0 28px 80px rgba(0, 0, 0, 0.5)' }}
        backdropFilter="blur(18px)"
      >
        <Box
          aria-hidden="true"
          data-wallet-drag-handle="true"
          display={{ base: 'flex', lg: 'none' }}
          position="relative"
          zIndex={ 4 }
          h="24px"
          alignItems="center"
          justifyContent="center"
          cursor={ isDragging ? 'grabbing' : 'grab' }
          touchAction="none"
          onPointerDown={ handleDragStart }
          onPointerMove={ handleDragMove }
          onPointerUp={ handleDragEnd }
          onPointerCancel={ handleDragEnd }
        >
          <Box
            w="40px"
            h="4px"
            borderRadius="full"
            bg={{ _light: 'rgba(15, 118, 110, 0.28)', _dark: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Box>
        <DakotaStarfield ambientInset="-12px" glimmerInset="-6px"/>
        <DialogHeader
          position="relative"
          zIndex={ 3 }
          textAlign="center"
          px={ 12 }
          py={{ base: 3, lg: 4 }}
          css={{
            '& [data-part="title"]': {
              width: '100%',
              textAlign: 'center',
            },
            '& [data-part="close-trigger"]': {
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              marginInlineStart: 0,
            },
          }}
        >
          { view === 'account' ? 'Connected wallet' : 'Connect wallet' }
        </DialogHeader>
        <DialogBody
          position="relative"
          zIndex={ 3 }
          px={{ base: 4, sm: 6 }}
          pb={{ base: 4, lg: 6 }}
          textAlign="center"
        >
          { view === 'account' ? accountContent : connectContent }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

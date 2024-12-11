'use client'
import {Button, Container, Group, Image, Text, Tooltip} from "@mantine/core";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
        async () =>
                (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
        {ssr: false}
);

export function Header() {
  return (

          <Group justify="space-between" h={64} w={'100%'}>
            <Group gap={11}>
              <Image width={48} height={26} src={'https://ai16z.s3.amazonaws.com/public/web/elizaos/logo.svg'}/>
              <Text fw={900} fz={26} lh={'30px'} color={'#FF7438'}>
                Eliza.Art
              </Text>
            </Group>

            <Group gap={12}>
              <Tooltip
                      position="bottom"
                      label="Comming soon"
                      withArrow
              >
                <Button radius={12} miw={150} h={44} bg={'#000000'}>
                  <Text fw={700} fz={16} size={'20'} color={'#FF9138'}>
                    Create
                  </Text>
                </Button>
              </Tooltip>
              <WalletMultiButtonDynamic
                      style={{
                        borderRadius: 12,
                        minWidth: 150,
                        height: 40,
                        backgroundColor: '#FF9138',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: '20px',
                      }}
              />
              {/*<Button radius={12} miw={150} h={44} bg={'#FF9138'}>*/}
              {/*  <Text fw={700} fz={16} size={'20'} color={'#000000'}>*/}
              {/*    Connect*/}
              {/*  </Text>*/}
              {/*</Button>*/}
            </Group>
          </Group>

  )
}
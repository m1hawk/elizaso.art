'use client';

import {Box, Button, Group, Image, Modal, Stack, Text, Center} from "@mantine/core";
import {CusCarousel} from "@/components/CusCarousel";
import {mintNFT} from "@/lib/umi/collection";
import {useDisclosure} from "@mantine/hooks";
import {PiCheckFatDuotone} from "react-icons/pi";
import {useState} from "react";
import {useRequest} from "ahooks";

export default function Home() {


  const [opened, {open, close}] = useDisclosure(false);

  const [link, setLink] = useState('')
  const {loading, run: mint} = useRequest(async () => {
    try {
      const res = await mintNFT({
        collectionAddress: 'GrN11tGqMghRE8vP74YXw4j7YG7hhDFV5vUkrDNXXhEw',
        adminPublicKey: 'EE49vy1uWakjSgYWuPDeUXxn6W6kBhBS4qz1zYEZzudy',
        name: 'text nft',
        uri: 'test',
        fee: 0
      })
      setLink(res.link)
      open()
      return res
    } catch (e: any) {
      console.log(e);
    }
  }, {
    manual: true
  })


  return (


          <>
            <Box>
              <Stack>
                <Text fw={800} fz={48} lh={'58px'} color={'#000'}>
                  Launch you NFT based on <Text span fw={800} fz={48} lh={'58px'} color={'#FF7438'}>ElizaOS</Text>
                </Text>
                <Text fw={800} fz={48} lh={'58px'} color={'#000'}>
                  Build your NFT community via <Text span fw={800} fz={48} lh={'58px'} color={'#FF7438'}>ElizaOS </Text>
                </Text>
              </Stack>
            </Box>
            <Box mt={40}
                 bg={'#000'}
                 w={'100%'}
                 h={592}
                 style={{
                   background: '#000',
                   borderRadius: 22
                 }}
            >
              <Stack gap={40} h={'100%'}>
                <Box pt={54} style={{flex: 1}}>

                  <Box style={{position: 'relative'}}>
                    <CusCarousel/>
                    <Box w={410} h={410}
                         style={{
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           width: '100%',
                           height: '100%',
                           transform: 'translate(-50%, -50%)',

                           background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 71.67%, rgba(0, 0, 0, 0.8) 100%)'
                         }}
                    >
                      <Text fw={700} fz={16} lh={'20px'} color={'#fff'}
                            style={{

                              position: 'absolute',
                              bottom: '20px',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                      >
                        Total Supply 635/10,000
                      </Text>
                    </Box>


                  </Box>
                </Box>

                <Stack gap={20} pb={20} justify={'center'} align={'center'}>
                  <Button w={280} h={44} radius={12} bg={'#FF7438'}
                          onClick={mint}
                          loading={loading}
                  >
                    0.1sol for Mint
                  </Button>

                </Stack>

              </Stack>

            </Box>
            <Stack align="stretch"
                   justify="center" mt={24} mb={96} bg={'#1A1A1A'} maw={868} mih={60} mx={'auto'}
                   style={{borderRadius: 16}}>
              <Group h={'100%'} justify={'center'} gap={10}>
                <Text style={{
                  background: 'linear-gradient(108.79deg, #FFBFBF 25.65%, #C5F07F 51.62%, #CC7FF0 85.76%)',
                  '-webkit-background-clip': 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  Eliza is the first ElizaOS based NFT collection
                </Text>
                <a href="https://github.com/xwxtwd/eliza" target={'_blank'} rel={'noopener noreferrer'}>
                  <Image width={24} height={24}
                         src={'https://ai16z.s3.amazonaws.com/public/web/elizaos/github-fill.svg'}/>
                </a>
              </Group>
            </Stack>
            <Modal opened={opened}
                   centered
                   onClose={() => {
                     close()
                     setLink('')
                   }}
            >
              {/* Modal content */}
              <Stack gap={10}>
                <Center>
                  <Group
                          justify={'center'}
                          w={60}
                          h={60}
                          style={{background: 'green', borderRadius: 60}}
                  >
                    <PiCheckFatDuotone size={40} color={'#fff'}/>
                  </Group>
                </Center>
                <Text fw={700} fz={20} ta={'center'} color={'green'}>Success!</Text>
              </Stack>
              <Center>
                <a href={link} target={'_blank'} rel={'noopener noreferrer'}>
                  <Button mt={20} style={{background: '#000', color: '#FF7438'}}>
                    view in explore
                  </Button>
                </a>
              </Center>

            </Modal>
          </>


  );
}

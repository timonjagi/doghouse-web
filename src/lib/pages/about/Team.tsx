import {
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Img,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

export const Team = () => {
  const members = [
    {
      role: 'Co-Founder / CEO',
      image:
        'images/team/1.jpg',
      name: 'Anthony Njagi',
      socials: [
        {
          href: 'https://www.linkedin.com/in/njagi-anthony/',
          icon: FaLinkedin
        },
        {
          href: 'https://twitter.com/AnthonyNjagi',
          icon: FaTwitter
        }
      ]
    },
    {
      role: 'Co-Founder / CTO',
      image: '/images/team/2.jpeg',
      name: 'Timothy Njagi',
      socials: [
        {
          href: 'https://github.com/timonjagi',
          icon: FaGithub
        }, {

          href: 'https://www.linkedin.com/in/timothy-njagi/',
          icon: FaLinkedin
        },

        {
          href: 'https://twitter.com/njihianjagi',
          icon: FaTwitter
        }
      ]
    }
    //   {
    //     role: 'Marketing Manager',
    //     image:
    //       'https://images.unsplash.com/photo-1521296797187-726205347ca9?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NTd8fGxhZHklMjBzbWlsaW5nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    //     name: 'Kim Yung',
    //     description: 'Quis risus sed vulputate odio ut enim blandit volutpat. Amet cursus sit amet.',
    //   },
    //   {
    //     role: 'Manager, Business Relations',
    //     image:
    //       'https://images.unsplash.com/photo-1524660988542-c440de9c0fde?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTYwfHxibGFjayUyMGd1eXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    //     name: 'Morgan Adebayo',
    //     description: 'Consectetur libero id faucibus nisl tincidunt eget nullam fringilla urna.',
    //   },
    //   {
    //     role: 'Chief Operating Officer',
    //     image:
    //       'https://images.unsplash.com/photo-1522938974444-f12497b69347?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NzJ8fGJsYWNrJTIwbGFkeXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    //     name: 'Bimbo Akintola',
    //     description: 'Mi eget mauris pharetra et ultrices neque ornare aenean massa eget egestas.',
    //   },
    //   {
    //     role: 'Head of Human Resources',
    //     image:
    //       'https://images.unsplash.com/photo-1574034589502-9f8a1ed46fa7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTMxfHxsYWR5JTIwc21pbGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    //     name: 'Yasmine Jones',
    //     description: 'Diam maecenas sed enim ut sem viverra aliquet eget magna ac placerat.',
    //   },
  ]

  return (
    <Stack spacing={{ base: '12', md: '16' }}>
      <Stack
        spacing={{ base: '8', md: '10' }}
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
      >
        <Stack spacing="3" maxW="3xl">
          {/* <Text fontSize={{ base: 'sm', md: 'md' }} color="accent" fontWeight="semibold">
            Team
          </Text> */}
          <Stack spacing={{ base: '4', md: '5' }}>
            <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>Meet our team</Heading>
            {/* <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted">
              We are a team of talented people who are passionate about what we do.
            </Text> */}
          </Stack>
        </Stack>
        {/* <Stack direction={{ base: 'column-reverse', md: 'row' }} spacing="3">
          <Button variant="secondary" size="lg">
            Contact us
          </Button>
          <Button variant="primary" size="lg">
            Join our team
          </Button>
        </Stack> */}
      </Stack>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        columnGap="8"
        rowGap={{ base: '10', lg: '16' }}
      >
        {members.map((member) => (
          <Stack key={member.name} spacing="4">
            <Stack spacing="5">
              <Img src={member.image} alt={member.name} h="72" objectFit="cover" />
              <Stack spacing="1">
                <Text fontWeight="medium" fontSize={{ base: 'lg', md: 'xl' }}>
                  {member.name}
                </Text>
                <Text color="accent" fontSize={{ base: 'md', md: 'lg' }}>
                  {member.role}
                </Text>
              </Stack>
            </Stack>
            <HStack spacing="4" color="subtle">
              {member.socials.map((social, id) => (
                <Link href={social.href} key={id}>
                  <Icon as={social.icon} boxSize="5" color="brand.600" />
                </Link>
              ))}
            </HStack>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  )
}
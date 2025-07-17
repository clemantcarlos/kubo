import { ChevronRight } from 'lucide-react';
import { SearchForm } from '../components/search-form';
import { VersionSwitcher } from '../components/version-switcher';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Link, useMatches } from 'react-router';

const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'POS',
      url: '/pos',
      items: [
        {
          title: 'Activity',
          url: '/pos/activity',
        },
        {
          title: 'Report',
          url: '/pos/report',
        },
        {
          title: 'Inventory',
          url: '/pos/inventory',
        },
        {
          title: 'Settings',
          url: '/pos/settings',
        }
      ],
    },
    {
      title: 'Restaurante',
      url: '#',
      items: [
        {
          title: 'Mesas',
          url: 'tables',
        },
        {
          title: 'Mesoneros',
          url: 'waiters',
        },
      ],
    },
    {
      title: 'Inventario',
      url: '#',
      items: [
        {
          title: 'Productos',
          url: 'products',
        },
        {
          title: 'Compras',
          url: 'purchase',
        },
        {
          title: 'Proveedores',
          url: 'suppliers',
        },
      ],
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const matches = useMatches() as unknown as Array<{
    handle: { crumb?: string };
    pathname: string;
  }>;

  const crumb = matches
  .filter((match) => match.handle?.crumb)
  .map((match) => ({
    crumb: match.handle.crumb as string
    ,
  }));
  return (
    <Sidebar {...props} className='z-[9999]'>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className='gap-0'>
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className='group/collapsible'
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className='group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              >
                <CollapsibleTrigger>
                  {item.title}{' '}
                  <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild 
                          isActive={item.title.toLowerCase() === crumb[0].crumb.toLowerCase()}>
                          <Link to={item.url} className='ms-2'>{item.title} </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

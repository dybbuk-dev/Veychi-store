import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import Label from '@mui/icons-material/Label';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { useTranslation } from 'next-i18next';
import SidebarItem from '../navigation/sidebar-item';

interface ISidebarChildren {
  href: string;
  label: string;
  icon: string;
}
interface ISidebarLink {
  label: string;
  allowedRoles: string[];
  children: ISidebarChildren[];
}

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;
  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            style={{
              color: 'rgba(25,25,25,0.7)',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily:
                'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
            }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

export default function CustomTreeview({
  items,
  userData,
}: {
  items: ISidebarLink[];
  userData: any;
}) {
  const { t } = useTranslation();
  const permissions = React.useMemo(() => {
    return userData?.data?.permissions.map((item: any) => item.name) ?? [];
  }, [userData]);
  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
    >
      {items
        .filter((item: any) => {
          if (!item.allowedRoles) return true;
          return item.allowedRoles.some((r: string) => permissions.includes(r));
        })
        .map((item: any, i: number) => (
          <StyledTreeItem
            nodeId={i.toString()}
            labelText={item.label}
            labelIcon={Label}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '2.5rem',
              }}
            >
              {item.children
                .filter((item: any) => {
                  if (!item.allowedRoles) return true;
                  return item.allowedRoles.some((r: string) =>
                    permissions.includes(r)
                  );
                })
                .map((child: any, childIndex: string) => (
                  <SidebarItem
                    {...child}
                    label={t(child.label)}
                    key={childIndex}
                  />
                ))}
            </div>
            {/* <StyledTreeItem
            nodeId="5"
            labelText="Social"
            labelIcon={SupervisorAccountIcon}
            labelInfo=""
            color="#1a73e8"
            bgColor="#e8f0fe"
          /> */}
          </StyledTreeItem>
        ))}
    </TreeView>
  );
}

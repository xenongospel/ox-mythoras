import {
  Monitor,
  Package,
  Map,
  MessageSquare,
  GitBranch,
  Users,
  Search,
  Trophy,
  Inbox,
} from "lucide-react";
import { ChatPanel } from "../components/archived_panels_v0/ChatPanel";
import { SimpleGameViewPanel } from "../components/SimpleGameViewPanel";
import { SimpleSquadPanel } from "../components/archived_panels_v0/SimpleSquadPanel";
import { InventoryPanel } from "../components/archived_panels_v0/InventoryPanel";
import { WorldMapPanel } from "../components/archived_panels_v0/WorldMapPanel";
import { CompetitionsPanel } from "../components/archived_panels_v0/CompetitionsPanel";
import { BasicPlaceholder } from "../components/BasicPlaceholder";
import { PanelConfig } from "../types/panel";

// Create consistent React components for all panels
const PassiveTreePanel = (props: any) => (
  <BasicPlaceholder title="Passive Tree" icon={GitBranch} {...props} />
);

const CreaturesPanel = (props: any) => (
  <BasicPlaceholder title="Creatures" icon={Users} {...props} />
);

const ScoutingPanel = (props: any) => (
  <BasicPlaceholder title="Scouting" icon={Search} {...props} />
);

const InboxPanel = (props: any) => (
  <BasicPlaceholder title="Inbox" icon={Inbox} {...props} />
);

export const PANEL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  gameview: SimpleGameViewPanel,
  chat: ChatPanel,
  squad: SimpleSquadPanel,
  inventory: InventoryPanel,
  worldmap: WorldMapPanel,
  passivetree: PassiveTreePanel,
  creatures: CreaturesPanel,
  scouting: ScoutingPanel,
  competitions: CompetitionsPanel,
  inbox: InboxPanel,
};

export const PANEL_CONFIGS: Record<string, PanelConfig> = {
  gameview: {
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1200,
    maxHeight: 800,
    title: "Game View",
    icon: Monitor,
    isMainView: true,
    canResize: true,
  },
  inventory: {
    minWidth: 380,
    minHeight: 420,
    maxWidth: 600,
    maxHeight: 650,
    title: "Inventory",
    icon: Package,
    canResize: true,
  },
  worldmap: {
    minWidth: 450,
    minHeight: 400,
    maxWidth: 800,
    maxHeight: 700,
    title: "World Map",
    icon: Map,
    canResize: true,
  },
  chat: {
    minWidth: 280,
    minHeight: 150,
    maxHeight: 400,
    title: "Chat",
    icon: MessageSquare,
    canResize: true,
  },
  passivetree: {
    minWidth: 500,
    minHeight: 400,
    title: "Passive Tree",
    icon: GitBranch,
    canResize: true,
  },
  creatures: {
    minWidth: 320,
    minHeight: 400,
    title: "Creatures",
    icon: Users,
    canResize: true,
  },
  squad: {
    minWidth: 350,
    minHeight: 300,
    title: "Squad",
    icon: Users,
    canResize: true,
  },
  scouting: {
    minWidth: 350,
    minHeight: 400,
    title: "Scouting",
    icon: Search,
    canResize: true,
  },
  competitions: {
    minWidth: 380,
    minHeight: 450,
    maxWidth: 600,
    maxHeight: 700,
    title: "Competitions",
    icon: Trophy,
    canResize: true,
  },
  inbox: {
    minWidth: 350,
    minHeight: 400,
    title: "Inbox",
    icon: Inbox,
    canResize: true,
  },
};
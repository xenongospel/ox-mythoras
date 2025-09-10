import React, { useState } from "react";
import {
  Users,
  Star,
  Zap,
  Shield,
  Swords,
  Eye,
  Settings,
  RotateCcw,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

// Types
interface Creature {
  id: string;
  name: string;
  species: string;
  type: "primary" | "secondary" | "tertiary";
  rarity: "common" | "rare" | "epic" | "legendary";
  attributes: {
    authority: number;
    order: number;
    animus: number;
    invictus: number;
    myth: number;
  };
  abilities: string[];
  bonded: boolean;
  imageUrl?: string;
  description: string;
  origin: string;
}

interface SquadSlot {
  id: string;
  position: number;
  creature: Creature | null;
}

// Squad data - all slots available, no restrictions
const INITIAL_SQUAD: SquadSlot[] = [
  {
    id: "slot-1",
    position: 1,
    creature: {
      id: "starter-001",
      name: "Lumina",
      species: "Crystal Wisp",
      type: "primary",
      rarity: "common",
      attributes: {
        authority: 12,
        order: 8,
        animus: 15,
        invictus: 10,
        myth: 5,
      },
      abilities: ["Crystal Resonance", "Light Beam"],
      bonded: true,
      description:
        "A young crystal wisp with natural affinity for light magic. Your first bonded creature.",
      origin: "Valdris Crystal Gardens",
    },
  },
  {
    id: "slot-2",
    position: 2,
    creature: {
      id: "creature-002",
      name: "Ember",
      species: "Fire Salamander",
      type: "secondary",
      rarity: "rare",
      attributes: {
        authority: 8,
        order: 12,
        animus: 18,
        invictus: 14,
        myth: 7,
      },
      abilities: ["Flame Burst", "Heat Shield", "Ignite"],
      bonded: false,
      description:
        "A fierce fire salamander with natural flame manipulation abilities. Known for its aggressive combat style.",
      origin: "Pyroclasm Caverns",
    },
  },
  {
    id: "slot-3",
    position: 3,
    creature: null,
  },
  {
    id: "slot-4",
    position: 4,
    creature: null,
  },
  {
    id: "slot-5",
    position: 5,
    creature: null,
  },
  {
    id: "slot-6",
    position: 6,
    creature: null,
  },
];

// Helper functions
const getRarityColor = (rarity: Creature["rarity"]) => {
  switch (rarity) {
    case "common":
      return "text-text-2 border-text-3";
    case "rare":
      return "text-info border-info";
    case "epic":
      return "text-violet-500 border-violet-500";
    case "legendary":
      return "text-warn border-warn";
    default:
      return "text-text-3 border-border";
  }
};

const getTypeIcon = (type: Creature["type"]) => {
  switch (type) {
    case "primary":
      return Swords;
    case "secondary":
      return Shield;
    case "tertiary":
      return Star;
    default:
      return Eye;
  }
};

interface SimpleSquadPanelProps {
  width?: number;
  height?: number;
}

export const SimpleSquadPanel: React.FC<
  SimpleSquadPanelProps
> = ({ width = 350, height = 300 }) => {
  const [squad, setSquad] =
    useState<SquadSlot[]>(INITIAL_SQUAD);

  const handleSlotClick = (slotId: string) => {
    console.log("Slot clicked:", slotId);
    // Here you would implement creature selection/swapping logic
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full bg-surface-0 flex flex-col p-4 overflow-y-auto">
        {/* Single Tab - No Tactics */}
        <div className="flex-1 flex flex-col">
          {/* Squad Content - Fixed scrolling */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="space-y-3">
              {squad.map((slot) => (
                <div
                  key={slot.id}
                  className={`
                    group relative bg-surface-1 border-2 cursor-pointer hover-transition
                    ${
                      slot.creature
                        ? "border-teal-500 hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20"
                        : "border-border border-dashed hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20"
                    }
                  `}
                  style={{
                    borderRadius: "8px",
                    height: "80px",
                  }}
                  onClick={() => handleSlotClick(slot.id)}
                >
                  {slot.creature ? (
                    // Filled Slot
                    <div className="p-3 h-full flex items-center gap-3">
                      {/* Creature Avatar */}
                      <div className="w-12 h-12 bg-surface-0 border border-border rounded-full flex items-center justify-center">
                        {React.createElement(
                          getTypeIcon(slot.creature.type),
                          {
                            className: "w-6 h-6 text-teal-500",
                          },
                        )}
                      </div>

                      {/* Creature Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="text-text-1 text-sm tracking-wider truncate group-hover:text-white hover-transition"
                            style={{
                              fontFamily: "Cinzel, serif",
                            }}
                          >
                            {slot.creature.name}
                          </h4>
                          <Badge
                            className={`${getRarityColor(slot.creature.rarity)} bg-opacity-20 text-xs`}
                          >
                            {slot.creature.rarity}
                          </Badge>
                        </div>
                        <div className="text-xs text-text-3 tracking-wide mb-1 group-hover:text-white hover-transition">
                          {slot.creature.species}
                        </div>

                        {/* Attributes - Compact Display */}
                        <div className="bg-bg-canvas px-2 py-1 border border-border group-hover:bg-surface-1 hover-transition" style={{ borderRadius: '4px' }}>
                          <div className="flex items-center justify-center gap-2 text-xs">
                            <div className="flex items-center gap-1 text-teal-500">
                              <Swords className="w-3 h-3" />
                              <span className="mono">
                                {
                                  slot.creature.attributes
                                    .authority
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-violet-500">
                              <Shield className="w-3 h-3" />
                              <span className="mono">
                                {slot.creature.attributes.order}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-warn">
                              <Zap className="w-3 h-3" />
                              <span className="mono">
                                {slot.creature.attributes.animus}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-danger">
                              <Star className="w-3 h-3" />
                              <span className="mono">
                                {slot.creature.attributes.invictus}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-info">
                              <Eye className="w-3 h-3" />
                              <span className="mono">
                                {slot.creature.attributes.myth}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Position Number */}
                      <div className="text-xs text-text-3 mono bg-surface-0 border border-border rounded px-2 py-1">
                        #{slot.position}
                      </div>
                    </div>
                  ) : (
                    // Empty Slot
                    <div className="p-3 h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-surface-0 border border-border rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="w-4 h-4 text-text-3" />
                        </div>
                        <div className="text-xs text-text-3 tracking-wide group-hover:text-white hover-transition">
                          Empty Slot
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tooltip for filled slots */}
                  {slot.creature && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute inset-0" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-surface-0 border-border text-text-1 p-3 max-w-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {React.createElement(
                              getTypeIcon(slot.creature.type),
                              {
                                className:
                                  "w-4 h-4 text-teal-500",
                              },
                            )}
                            <span
                              className="text-sm tracking-wider"
                              style={{
                                fontFamily: "Cinzel, serif",
                              }}
                            >
                              {slot.creature.name}
                            </span>
                          </div>
                          <div className="text-xs text-text-2 tracking-wide">
                            {slot.creature.species} •{" "}
                            {slot.creature.type}
                          </div>
                          <div className="text-xs text-text-2 tracking-wide leading-relaxed">
                            {slot.creature.description}
                          </div>

                          {/* Full Attributes */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Swords className="w-3 h-3 text-teal-500" />
                              <span className="text-text-3">
                                Authority:
                              </span>
                              <span className="mono text-text-1">
                                {
                                  slot.creature.attributes
                                    .authority
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-violet-500" />
                              <span className="text-text-3">
                                Order:
                              </span>
                              <span className="mono text-text-1">
                                {slot.creature.attributes.order}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-warn" />
                              <span className="text-text-3">
                                Animus:
                              </span>
                              <span className="mono text-text-1">
                                {
                                  slot.creature.attributes
                                    .animus
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-danger" />
                              <span className="text-text-3">
                                Invictus:
                              </span>
                              <span className="mono text-text-1">
                                {
                                  slot.creature.attributes
                                    .invictus
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-info" />
                              <span className="text-text-3">
                                M.Y.T.H:
                              </span>
                              <span className="mono text-text-1">
                                {
                                  slot.creature.attributes
                                    .myth
                                }
                              </span>
                            </div>
                          </div>

                          {/* Abilities */}
                          {slot.creature.abilities.length >
                            0 && (
                            <div>
                              <div className="text-xs text-violet-500 tracking-wide mb-1">
                                Abilities:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {slot.creature.abilities.map(
                                  (ability, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {ability}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-text-3 tracking-wide">
                            Origin: {slot.creature.origin}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Squad Summary */}
          <div className="mt-4 pt-3 border-t border-border">
            <div
              className="bg-surface-1 border border-border p-3"
              style={{ borderRadius: "8px" }}
            >
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-text-3 tracking-wide mb-1">
                    Active Creatures
                  </div>
                  <div className="text-text-1 mono tracking-wide">
                    {
                      squad.filter((slot) => slot.creature)
                        .length
                    }
                    /6
                  </div>
                </div>
                <div>
                  <div className="text-text-3 tracking-wide mb-1">
                    Squad Status
                  </div>
                  <div className="text-ok tracking-wide">
                    Ready
                  </div>
                </div>
              </div>

              {/* Average Stats */}
              {squad.some((slot) => slot.creature) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-text-3 tracking-wide mb-2 text-xs">
                    Average Attributes
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Swords className="w-3 h-3 text-teal-500" />
                      <span className="mono text-text-1">
                        {Math.round(
                          squad
                            .filter((s) => s.creature)
                            .reduce(
                              (acc, s) =>
                                acc +
                                (s.creature?.attributes
                                  .authority || 0),
                              0,
                            ) /
                            squad.filter((s) => s.creature)
                              .length,
                        ) || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-violet-500" />
                      <span className="mono text-text-1">
                        {Math.round(
                          squad
                            .filter((s) => s.creature)
                            .reduce(
                              (acc, s) =>
                                acc +
                                (s.creature?.attributes.order ||
                                  0),
                              0,
                            ) /
                            squad.filter((s) => s.creature)
                              .length,
                        ) || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-warn" />
                      <span className="mono text-text-1">
                        {Math.round(
                          squad
                            .filter((s) => s.creature)
                            .reduce(
                              (acc, s) =>
                                acc +
                                (s.creature?.attributes
                                  .animus || 0),
                              0,
                            ) /
                            squad.filter((s) => s.creature)
                              .length,
                        ) || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-danger" />
                      <span className="mono text-text-1">
                        {Math.round(
                          squad
                            .filter((s) => s.creature)
                            .reduce(
                              (acc, s) =>
                                acc +
                                (s.creature?.attributes
                                  .invictus || 0),
                              0,
                            ) /
                            squad.filter((s) => s.creature)
                              .length,
                        ) || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-info" />
                      <span className="mono text-text-1">
                        {Math.round(
                          squad
                            .filter((s) => s.creature)
                            .reduce(
                              (acc, s) =>
                                acc +
                                (s.creature?.attributes
                                  .myth || 0),
                              0,
                            ) /
                            squad.filter((s) => s.creature)
                              .length,
                        ) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
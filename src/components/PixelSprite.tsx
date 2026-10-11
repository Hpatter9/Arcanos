import React from 'react';
import { HeroId } from '../types/game';

interface PixelSpriteProps {
  id: string; // heroId or enemyId
  size?: number; // size in px
  action?: 'idle' | 'attack' | 'cast' | 'hurt' | 'victory';
  direction?: 'left' | 'right';
  className?: string;
  isBoss?: boolean;
}

// 16-bit SNES Palette Constants (Authentic Final Fantasy VI Aesthetic)
export const PALETTE = {
  skinLight: '#FAD6B8',
  skinMid: '#E8A77A',
  skinDark: '#B86F48',
  
  // Viking Ragnar (Norse)
  vikingHair: '#E5A93C',
  vikingHairShadow: '#A66B18',
  vikingLeather: '#6D4C41',
  vikingLeatherDark: '#3E2723',
  vikingFur: '#CFD8DC',
  vikingSteel: '#90A4AE',
  vikingSteelHighlight: '#ECEFF1',
  vikingFrost: '#38BDF8',
  
  // Samurai Tomoe (Feudal Japan)
  samuraiHair: '#1A1A24',
  samuraiArmor: '#065F46',
  samuraiArmorLight: '#10B981',
  samuraiGold: '#F59E0B',
  samuraiCloth: '#ECFDF5',
  samuraiBlade: '#E2E8F0',
  samuraiHamon: '#38BDF8',
  
  // General Guan (Imperial China)
  guanRobe: '#047857',
  guanRobeLight: '#10B981',
  guanArmorGold: '#D97706',
  guanArmorHighlight: '#FBBF24',
  guanBeard: '#18181B',
  guanCloak: '#DC2626',
  guanHalberd: '#F59E0B',
  
  // Nefertari (Ancient Egypt)
  egyptianGold: '#F59E0B',
  egyptianGoldLight: '#FDE68A',
  egyptianLapis: '#1D4ED8',
  egyptianTurquoise: '#06B6D4',
  egyptianWhite: '#F8FAFC',
  egyptianWhiteShadow: '#94A3B8',
  egyptianRuby: '#EF4444',
  
  // Enemies Palette
  draugrBone: '#94A3B8',
  draugrIce: '#38BDF8',
  draugrRust: '#78350F',
  tenguRed: '#B91C1C',
  tenguFeather: '#1E293B',
  terracottaClay: '#C2410C',
  terracottaShadow: '#7C2D12',
  anubisBlack: '#0F172A',
  anubisGold: '#F59E0B',
  bansheeCyan: '#22D3EE',
  jiangshiIndigo: '#312E81',
  apepOrange: '#EA580C',
  surtrFlame: '#EF4444',
  surtrCore: '#FDE047',
  surtrDark: '#450A0A',
};

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  id,
  size = 48,
  action = 'idle',
  direction = 'right',
  className = '',
  isBoss = false,
}) => {
  const isFlip = direction === 'left';

  // Animation CSS transforms based on action
  let animClass = '';
  if (action === 'idle') animClass = 'animate-[bounce_2s_infinite_ease-in-out]';
  if (action === 'attack') animClass = 'animate-[pulse_0.4s_ease-in-out] scale-110';
  if (action === 'cast') animClass = 'animate-[ping_0.8s_cubic-bezier(0,0,0.2,1)]';
  if (action === 'hurt') animClass = 'brightness-200 saturate-200 -translate-x-1';

  return (
    <div
      style={{
        width: isBoss ? size * 1.5 : size,
        height: isBoss ? size * 1.5 : size,
        transform: isFlip ? 'scaleX(-1)' : undefined,
        imageRendering: 'pixelated',
      }}
      className={`relative inline-block select-none pointer-events-none ${animClass} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
        className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
      >
        {/* RAGNAR BLOODAXE (VIKING BERSERKER) */}
        {id === 'ragnar' && (
          <g>
            {/* Horns on helmet */}
            <rect x="5" y="2" width="2" height="2" fill={PALETTE.vikingFur} />
            <rect x="17" y="2" width="2" height="2" fill={PALETTE.vikingFur} />
            <rect x="6" y="3" width="2" height="2" fill={PALETTE.vikingSteel} />
            <rect x="16" y="3" width="2" height="2" fill={PALETTE.vikingSteel} />
            {/* Iron Spangenhelm Helmet */}
            <rect x="8" y="3" width="8" height="4" fill={PALETTE.vikingSteel} />
            <rect x="9" y="4" width="6" height="1" fill={PALETTE.vikingSteelHighlight} />
            <rect x="11" y="5" width="2" height="3" fill={PALETTE.vikingSteel} />
            {/* Face & Blonde Beard */}
            <rect x="9" y="7" width="6" height="3" fill={PALETTE.skinLight} />
            <rect x="10" y="7" width="1" height="1" fill="#18181B" />
            <rect x="13" y="7" width="1" height="1" fill="#18181B" />
            {/* Majestic Braided Beard */}
            <rect x="8" y="9" width="8" height="5" fill={PALETTE.vikingHair} />
            <rect x="9" y="14" width="6" height="2" fill={PALETTE.vikingHairShadow} />
            <rect x="11" y="16" width="2" height="1" fill={PALETTE.vikingHairShadow} />
            {/* Fur Pauldron & Torso */}
            <rect x="6" y="9" width="3" height="4" fill={PALETTE.vikingFur} />
            <rect x="15" y="9" width="3" height="4" fill={PALETTE.vikingFur} />
            <rect x="8" y="11" width="8" height="6" fill={PALETTE.vikingLeather} />
            <rect x="9" y="12" width="6" height="1" fill={PALETTE.vikingSteel} />
            {/* Belt & Buckle */}
            <rect x="8" y="17" width="8" height="2" fill={PALETTE.vikingLeatherDark} />
            <rect x="11" y="17" width="2" height="2" fill={PALETTE.vikingSteelHighlight} />
            {/* Trousers & Fur Boots */}
            <rect x="8" y="19" width="3" height="4" fill={PALETTE.vikingLeatherDark} />
            <rect x="13" y="19" width="3" height="4" fill={PALETTE.vikingLeatherDark} />
            <rect x="7" y="21" width="4" height="3" fill={PALETTE.vikingFur} />
            <rect x="13" y="21" width="4" height="3" fill={PALETTE.vikingFur} />
            {/* Left Hand: Frost Bearded Axe */}
            <rect x="3" y="8" width="2" height="12" fill={PALETTE.vikingLeatherDark} />
            <rect x="1" y="7" width="4" height="3" fill={PALETTE.vikingSteel} />
            <rect x="0" y="6" width="3" height="5" fill={PALETTE.vikingFrost} />
            {/* Right Hand: Dual Cleaver */}
            <rect x="19" y="9" width="2" height="10" fill={PALETTE.vikingLeatherDark} />
            <rect x="19" y="8" width="4" height="3" fill={PALETTE.vikingSteel} />
            <rect x="21" y="7" width="3" height="4" fill={PALETTE.vikingFrost} />
          </g>
        )}

        {/* TOMOE GOZEN (SAMURAI SHADOWBLADE) */}
        {id === 'tomoe' && (
          <g>
            {/* High Tied Topknot with Red Ribbon */}
            <rect x="11" y="1" width="3" height="3" fill={PALETTE.samuraiHair} />
            <rect x="10" y="3" width="4" height="1" fill={PALETTE.guanCloak} />
            {/* Flowing Dark Hair */}
            <rect x="8" y="3" width="8" height="5" fill={PALETTE.samuraiHair} />
            <rect x="7" y="6" width="3" height="7" fill={PALETTE.samuraiHair} />
            {/* Pale Elegant Face */}
            <rect x="9" y="6" width="6" height="4" fill={PALETTE.skinLight} />
            <rect x="11" y="7" width="1" height="1" fill="#18181B" />
            <rect x="14" y="7" width="1" height="1" fill="#18181B" />
            <rect x="12" y="9" width="2" height="1" fill="#E11D48" />
            {/* Emerald Lacquered O-Yoroi Pauldrons (Sode) */}
            <rect x="6" y="9" width="3" height="5" fill={PALETTE.samuraiArmor} />
            <rect x="6" y="10" width="3" height="1" fill={PALETTE.samuraiGold} />
            <rect x="15" y="9" width="3" height="5" fill={PALETTE.samuraiArmor} />
            <rect x="15" y="10" width="3" height="1" fill={PALETTE.samuraiGold} />
            {/* White Kimono & Emerald Breastplate (Do) */}
            <rect x="9" y="10" width="6" height="3" fill={PALETTE.samuraiCloth} />
            <rect x="9" y="12" width="6" height="4" fill={PALETTE.samuraiArmorLight} />
            {/* Red Obi Sash */}
            <rect x="9" y="16" width="6" height="2" fill={PALETTE.guanCloak} />
            <rect x="11" y="16" width="2" height="3" fill={PALETTE.samuraiGold} />
            {/* Pleated Hakama */}
            <rect x="8" y="18" width="4" height="5" fill={PALETTE.samuraiArmor} />
            <rect x="12" y="18" width="4" height="5" fill={PALETTE.samuraiArmor} />
            {/* Lacquered Shin Guards (Suneate) */}
            <rect x="8" y="22" width="3" height="2" fill={PALETTE.samuraiHair} />
            <rect x="13" y="22" width="3" height="2" fill={PALETTE.samuraiHair} />
            {/* Raised Muramasa Nodachi Katana with Wind Wave */}
            <rect x="18" y="3" width="1" height="16" fill={PALETTE.samuraiBlade} />
            <rect x="19" y="2" width="1" height="14" fill={PALETTE.samuraiHamon} />
            <rect x="17" y="17" width="3" height="1" fill={PALETTE.samuraiGold} />
            <rect x="17" y="18" width="2" height="4" fill={PALETTE.samuraiHair} />
            {/* Fluttering Cherry Blossom Petal */}
            <rect x="4" y="6" width="2" height="2" fill="#FDA4AF" />
            <rect x="2" y="11" width="1" height="1" fill="#F43F5E" />
          </g>
        )}

        {/* GENERAL GUAN (CHINESE DRAGON GENERAL) */}
        {id === 'guan' && (
          <g>
            {/* Green Dragon Headwrap & Golden Circlet */}
            <rect x="8" y="2" width="8" height="4" fill={PALETTE.guanRobe} />
            <rect x="8" y="5" width="8" height="1" fill={PALETTE.guanArmorHighlight} />
            <rect x="11" y="1" width="2" height="2" fill={PALETTE.guanCloak} />
            {/* Noble Visage */}
            <rect x="9" y="6" width="6" height="4" fill={PALETTE.skinMid} />
            <rect x="11" y="7" width="1" height="1" fill="#18181B" />
            <rect x="13" y="7" width="1" height="1" fill="#18181B" />
            {/* Legendary Flowing Long Black Beard */}
            <rect x="9" y="9" width="6" height="9" fill={PALETTE.guanBeard} />
            <rect x="10" y="18" width="4" height="3" fill={PALETTE.guanBeard} />
            {/* Golden Dragon Scale Lamellar & Silk Robe */}
            <rect x="5" y="9" width="4" height="5" fill={PALETTE.guanArmorGold} />
            <rect x="15" y="9" width="4" height="5" fill={PALETTE.guanRobe} />
            <rect x="8" y="10" width="8" height="7" fill={PALETTE.guanArmorGold} />
            <rect x="9" y="11" width="6" height="5" fill={PALETTE.guanArmorHighlight} />
            {/* Flowing Crimson Cape */}
            <rect x="4" y="10" width="3" height="12" fill={PALETTE.guanCloak} />
            {/* Silk Belt & Battle Skirt */}
            <rect x="8" y="16" width="8" height="2" fill={PALETTE.guanArmorGold} />
            <rect x="7" y="18" width="5" height="5" fill={PALETTE.guanRobe} />
            <rect x="12" y="18" width="5" height="5" fill={PALETTE.guanRobe} />
            {/* Black Boots */}
            <rect x="8" y="22" width="3" height="2" fill={PALETTE.guanBeard} />
            <rect x="13" y="22" width="3" height="2" fill={PALETTE.guanBeard} />
            {/* Green Dragon Crescent Blade (Guandao) */}
            <rect x="19" y="1" width="1" height="22" fill={PALETTE.vikingLeatherDark} />
            <rect x="17" y="0" width="4" height="6" fill={PALETTE.samuraiBlade} />
            <rect x="16" y="2" width="3" height="3" fill={PALETTE.guanArmorHighlight} />
            <rect x="18" y="0" width="1" height="5" fill={PALETTE.surtrCore} />
          </g>
        )}

        {/* NEFERTARI (EGYPTIAN HIGH SUN PRIESTESS) */}
        {id === 'nefertari' && (
          <g>
            {/* Golden Royal Nemes Headdress with Uraeus Cobra */}
            <rect x="8" y="2" width="8" height="4" fill={PALETTE.egyptianGold} />
            <rect x="11" y="1" width="2" height="2" fill={PALETTE.egyptianRuby} />
            <rect x="7" y="4" width="2" height="7" fill={PALETTE.egyptianLapis} />
            <rect x="15" y="4" width="2" height="7" fill={PALETTE.egyptianLapis} />
            {/* Regal Egyptian Face with Kohl Eyeliner */}
            <rect x="9" y="6" width="6" height="4" fill={PALETTE.skinMid} />
            <rect x="10" y="7" width="2" height="1" fill="#0F172A" />
            <rect x="13" y="7" width="2" height="1" fill="#0F172A" />
            <rect x="11" y="9" width="2" height="1" fill={PALETTE.egyptianRuby} />
            {/* Ornate Broad Collar (Wesekh) with Lapis & Turquoise */}
            <rect x="8" y="10" width="8" height="3" fill={PALETTE.egyptianGold} />
            <rect x="9" y="11" width="6" height="1" fill={PALETTE.egyptianTurquoise} />
            <rect x="10" y="12" width="4" height="1" fill={PALETTE.egyptianLapis} />
            {/* Pleated Royal White Linen Kalasiris Gown */}
            <rect x="9" y="13" width="6" height="9" fill={PALETTE.egyptianWhite} />
            <rect x="11" y="13" width="2" height="9" fill={PALETTE.egyptianWhiteShadow} />
            {/* Golden Belt with Ankh Buckle */}
            <rect x="9" y="15" width="6" height="2" fill={PALETTE.egyptianGold} />
            <rect x="11" y="16" width="2" height="2" fill={PALETTE.egyptianTurquoise} />
            {/* Golden Sandals */}
            <rect x="9" y="22" width="2" height="2" fill={PALETTE.egyptianGold} />
            <rect x="13" y="22" width="2" height="2" fill={PALETTE.egyptianGold} />
            {/* Glowing Sun Was-Scepter */}
            <rect x="18" y="4" width="1" height="19" fill={PALETTE.egyptianGold} />
            <rect x="16" y="2" width="5" height="3" fill={PALETTE.egyptianGoldLight} />
            {/* Solar Disc with Radiant Rays */}
            <circle cx="18.5" cy="3.5" r="2.5" fill={PALETTE.surtrCore} />
            {/* Golden Ankh in Left Hand */}
            <rect x="5" y="14" width="2" height="3" fill={PALETTE.egyptianGold} />
          </g>
        )}

        {/* DRAUGR BARROW-WIGHT (NORSE UNDEAD) */}
        {id === 'draugr_wight' && (
          <g>
            <rect x="8" y="3" width="8" height="4" fill={PALETTE.draugrRust} />
            <rect x="9" y="7" width="6" height="3" fill={PALETTE.draugrBone} />
            {/* Glowing Cyan Eyes */}
            <rect x="10" y="7" width="1" height="1" fill={PALETTE.draugrIce} />
            <rect x="13" y="7" width="1" height="1" fill={PALETTE.draugrIce} />
            {/* Rotting Leather & Bone Ribs */}
            <rect x="8" y="10" width="8" height="6" fill={PALETTE.vikingLeatherDark} />
            <rect x="9" y="11" width="6" height="1" fill={PALETTE.draugrBone} />
            <rect x="9" y="13" width="6" height="1" fill={PALETTE.draugrBone} />
            {/* Rusty Iron Tassets & Legs */}
            <rect x="8" y="16" width="8" height="6" fill={PALETTE.draugrRust} />
            {/* Rusted Frost Axe */}
            <rect x="4" y="8" width="1" height="13" fill={PALETTE.vikingLeatherDark} />
            <rect x="2" y="7" width="3" height="4" fill={PALETTE.draugrIce} />
          </g>
        )}

        {/* TENGU WIND-REAVER (JAPANESE YOKAI) */}
        {id === 'tengu_reaver' && (
          <g>
            <rect x="9" y="3" width="6" height="4" fill={PALETTE.tenguRed} />
            <rect x="15" y="5" width="3" height="2" fill="#D97706" /> {/* Beak */}
            <rect x="11" y="4" width="1" height="1" fill="#FEF08A" />
            {/* Black Crow Wings */}
            <rect x="3" y="6" width="5" height="10" fill={PALETTE.tenguFeather} />
            <rect x="16" y="6" width="4" height="8" fill={PALETTE.tenguFeather} />
            {/* Yamabushi Robes */}
            <rect x="8" y="8" width="8" height="10" fill="#F1F5F9" />
            <rect x="8" y="14" width="8" height="2" fill={PALETTE.tenguRed} />
            <rect x="9" y="18" width="6" height="5" fill={PALETTE.tenguFeather} />
            {/* Feathery Wind Bow */}
            <rect x="19" y="6" width="2" height="14" fill="#059669" />
          </g>
        )}

        {/* TERRACOTTA CLAY SENTINEL (CHINESE IMPERIAL) */}
        {id === 'terracotta_sentinel' && (
          <g>
            <rect x="8" y="2" width="8" height="6" fill={PALETTE.terracottaClay} />
            <rect x="10" y="1" width="4" height="2" fill={PALETTE.terracottaShadow} />
            <rect x="9" y="6" width="6" height="3" fill={PALETTE.terracottaClay} />
            {/* Armored Clay Plates */}
            <rect x="7" y="9" width="10" height="9" fill={PALETTE.terracottaClay} />
            <rect x="8" y="10" width="8" height="1" fill={PALETTE.terracottaShadow} />
            <rect x="8" y="13" width="8" height="1" fill={PALETTE.terracottaShadow} />
            <rect x="8" y="18" width="8" height="5" fill={PALETTE.terracottaShadow} />
            {/* Clay Halberd */}
            <rect x="19" y="2" width="1" height="21" fill={PALETTE.vikingLeatherDark} />
            <rect x="17" y="2" width="4" height="4" fill={PALETTE.terracottaClay} />
          </g>
        )}

        {/* ANUBITE CRYPT-STALKER (EGYPTIAN DUAT ASSASSIN) */}
        {id === 'anubite_stalker' && (
          <g>
            {/* Jackal Head with Long Pointed Ears */}
            <rect x="7" y="1" width="2" height="5" fill={PALETTE.anubisBlack} />
            <rect x="15" y="1" width="2" height="5" fill={PALETTE.anubisBlack} />
            <rect x="8" y="4" width="8" height="5" fill={PALETTE.anubisBlack} />
            <rect x="15" y="6" width="3" height="2" fill={PALETTE.anubisBlack} /> {/* Snout */}
            <rect x="11" y="5" width="1" height="1" fill={PALETTE.anubisGold} />
            {/* Golden Collar & Lean Dark Torso */}
            <rect x="8" y="9" width="8" height="2" fill={PALETTE.anubisGold} />
            <rect x="8" y="11" width="8" height="6" fill={PALETTE.anubisBlack} />
            {/* Shendyt Kilt & Lean Legs */}
            <rect x="8" y="17" width="8" height="4" fill={PALETTE.anubisGold} />
            <rect x="8" y="21" width="3" height="3" fill={PALETTE.anubisBlack} />
            <rect x="13" y="21" width="3" height="3" fill={PALETTE.anubisBlack} />
            {/* Twin Bronze Khopeshes */}
            <path d="M 3 10 Q 1 14 4 18" stroke={PALETTE.anubisGold} strokeWidth="1.5" fill="none" />
            <path d="M 20 8 Q 22 12 19 16" stroke={PALETTE.anubisGold} strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* CURSED BANSHEE (CELTIC/NORSE PHANTOM) */}
        {id === 'cursed_banshee' && (
          <g>
            <circle cx="12" cy="7" r="4" fill={PALETTE.bansheeCyan} opacity="0.9" />
            <rect x="10" y="6" width="1" height="1" fill="#083344" />
            <rect x="13" y="6" width="1" height="1" fill="#083344" />
            {/* Wailing Mouth */}
            <rect x="11" y="8" width="2" height="2" fill="#083344" />
            {/* Flowing Spectral Shroud */}
            <path d="M 8 11 Q 6 18 10 23 Q 12 18 14 23 Q 16 18 16 11 Z" fill={PALETTE.bansheeCyan} opacity="0.75" />
          </g>
        )}

        {/* JIANGSHI TAOIST (CHINESE OCCULT NECROMANCER) */}
        {id === 'jiangshi_taoist' && (
          <g>
            <rect x="8" y="3" width="8" height="3" fill={PALETTE.jiangshiIndigo} />
            <rect x="7" y="5" width="10" height="1" fill="#F43F5E" />
            <rect x="9" y="6" width="6" height="4" fill="#A7F3D0" /> {/* Pale Greenish Skin */}
            {/* Yellow Paper Talisman Seal hanging from forehead */}
            <rect x="11" y="4" width="2" height="5" fill="#FACC15" />
            {/* Qing Dynasty Dark Indigo Robes */}
            <rect x="7" y="10" width="10" height="11" fill={PALETTE.jiangshiIndigo} />
            <rect x="9" y="11" width="6" height="3" fill="#D97706" />
            <rect x="8" y="21" width="8" height="2" fill="#18181B" />
          </g>
        )}

        {/* APEP'S CHAOS SERPENT (EGYPTIAN MINI-BOSS) */}
        {id === 'apep_serpent' && (
          <g>
            {/* Horned Serpent Head */}
            <rect x="8" y="2" width="3" height="4" fill={PALETTE.surtrFlame} />
            <rect x="13" y="2" width="3" height="4" fill={PALETTE.surtrFlame} />
            <circle cx="12" cy="7" r="5" fill={PALETTE.apepOrange} />
            <rect x="9" y="6" width="1" height="1" fill={PALETTE.surtrCore} />
            <rect x="14" y="6" width="1" height="1" fill={PALETTE.surtrCore} />
            {/* Fangs & Venomous Tongue */}
            <rect x="11" y="10" width="2" height="3" fill="#EF4444" />
            {/* Coiled Serpent Body */}
            <path d="M 7 11 Q 2 15 7 19 Q 12 23 17 19 Q 22 15 17 11 Z" fill={PALETTE.apepOrange} />
            <path d="M 8 13 Q 5 15 8 17 Q 12 19 16 17 Q 19 15 16 13 Z" fill={PALETTE.surtrCore} opacity="0.6" />
          </g>
        )}

        {/* SURTR THE WORLD-ENDER (NORSE FINAL BOSS) */}
        {id === 'surtr_titan' && (
          <g>
            {/* Towering Fiery Horns */}
            <path d="M 5 2 L 8 6 L 6 7 Z" fill={PALETTE.surtrFlame} />
            <path d="M 19 2 L 16 6 L 18 7 Z" fill={PALETTE.surtrFlame} />
            {/* Molten Skull with Burning Eye Cavities */}
            <rect x="7" y="5" width="10" height="6" fill={PALETTE.surtrDark} />
            <rect x="9" y="7" width="2" height="2" fill={PALETTE.surtrCore} />
            <rect x="13" y="7" width="2" height="2" fill={PALETTE.surtrCore} />
            {/* Colossal Magma-Cracked Torso */}
            <rect x="5" y="11" width="14" height="9" fill={PALETTE.surtrDark} />
            <path d="M 7 12 L 12 16 L 17 12" stroke={PALETTE.surtrFlame} strokeWidth="1.5" fill="none" />
            <rect x="11" y="14" width="2" height="2" fill={PALETTE.surtrCore} />
            {/* Massive Twilight Greatsword */}
            <rect x="20" y="0" width="2" height="24" fill={PALETTE.surtrFlame} />
            <rect x="21" y="1" width="1" height="22" fill={PALETTE.surtrCore} />
            <rect x="18" y="18" width="5" height="2" fill={PALETTE.surtrDark} />
            {/* Magma Plated Legs */}
            <rect x="6" y="20" width="4" height="4" fill={PALETTE.surtrDark} />
            <rect x="14" y="20" width="4" height="4" fill={PALETTE.surtrDark} />
          </g>
        )}
      </svg>
    </div>
  );
};

<script lang="ts">
    import WorldMapLocation from "./WorldMapLocation.svelte";
    import Title from "./generic/Title.svelte";
</script>

<div>
    <Title label="World" />
    <div class="template worldmap">
        <img src="pictures/regions/world_map.png" alt="world map">
        
        <!-- Level 1 - 10 -->
        <WorldMapLocation x={24} y={30} area_id={"Training center"}/>
        <WorldMapLocation x={20} y={16} area_id={"Koloh's plains"}/>
        <WorldMapLocation x={9} y={32} area_id={"Dark forest"}/>
        <WorldMapLocation x={33} y={56} area_id={"Keyn's village"}/>
        <WorldMapLocation x={24} y={62} area_id={"Keyn's lair"}/>

        <!-- Level 11 - 20 -->
        <WorldMapLocation x={55} y={46} area_id={"Walker Bridge"}/>
        <WorldMapLocation x={67} y={57} area_id={"Neon City"}/>
        <WorldMapLocation x={58} y={70} area_id={"Neon Harbour"}/>
        <WorldMapLocation x={76} y={64} area_id={"The Undergrounds"}/>
        <WorldMapLocation x={71} y={76} area_id={"The pit"}/>

        <!-- Level 21 - 30 -->
        <WorldMapLocation x={36} y={79} area_id={"Wrecker Sea"}/>
        <WorldMapLocation x={28} y={82} area_id={"Hall of Corals"}/>
        <WorldMapLocation x={71} y={34} area_id={"Moppei's village"}/>
        <WorldMapLocation x={78} y={28} area_id={"Fire's path"}/>
        <WorldMapLocation x={72} y={18} area_id={"Implosion Point"}/>

        <!-- Level 31 - 40 -->
        <WorldMapLocation x={46} y={23} area_id={"Toori's passage"}/>
        <WorldMapLocation x={40} y={13} area_id={"Disillusion city"}/>
        <WorldMapLocation x={36} y={0} area_id={"Tower of contemplations"}/>
        <WorldMapLocation x={50} y={8} area_id={"Ice's path"}/>

        <!-- Level 41 - 50 -->
        <WorldMapLocation x={65} y={4} area_id={"Valley of ice"}/>
        <WorldMapLocation x={82} y={0} area_id={"Island of risk"}/>
        <WorldMapLocation x={8} y={17} area_id={"Island of savagery"}/>
        <WorldMapLocation x={6} y={69} area_id={"Island of dispair"}/>
        <WorldMapLocation x={44} y={38} area_id={"Meteor site"}/>

    </div>
</div>

<style>
    .template {
        border: solid black 1px;
        border-top: 0px;
    }
    .worldmap {
        position: relative;
    }
    .worldmap > img{
        display: block;
        width: 100%;
    }
</style>
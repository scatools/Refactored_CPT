import React from 'react';

const Appendix = () => {
    return (
        <div>
            <h2>Appendix:</h2>
            <div>
                <h4>Definitions of Raw Data Measures:</h4>
                <div>
                    <p>
                        <b>1. Project Area- </b>
                        The project area proposed for conservation is the area of interest defined or selected by the user. Multiple areas of interest may be aggregated into one project.
                    </p>
                    <p>
                        <b>2. Composition of Priority Natural Lands- </b>
                        This attribute prioritizes rare habitat types and those that have been identified as conservation priorities in state and regional plans. Scores reflect the proportion (%) of each area of interest that is covered by a priority land cover.
                    </p>
                    <p>
                        <b>3. Connectivity to Existing Protected Area- </b>
                        Connectivity to existing protected area indicates if the proposed conservation area is close to an area classified as protected by Protected Areas Database of the United States (PAD-US) 2.0 data (Gergeley 2016). Protected areas included International Union for Conservation of Nature (IUCN) Categories Ia-VI and U.S. Geological Survey Gap Analysis Program (GAP) Status 1–4 areas. A binary attribute represents the spatial relationship between a hexagon and a protected area within PAD-US 2.0. Any hexagon that directly intersects or is within a 1 km2 distance of a protected area would count as one, otherwise, zero.
                    </p>
                    <p>
                        <b>4. Threat of Urbanization- </b>
                        Threat of urbanization (ToU) indicates the likelihood of the given project area or area of interest (AoI) being urbanized by the year 2060. A ToU score of zero indicates the AoI is already urbanized. A ToU score of one indicates that there is absolutely no threat of urbanization. A ToU score between zero and one indicates the predicted likelihood of threat in decreasing order.
                    </p>
                    <p>
                        <b>5. Connectivity of Natural Lands- </b>
                        A percent attribute that stands for the proportion of area classified as a hub or corridor, according to the Intact Habitat Cores layer from Esri’s Green Infrastructure Initiative (Perkl 2019). This attribute prioritizes large protected areas and critical corridor connections.
                    </p>
                    <p>
                        <b>6. 303D: Impaired Watershed Area- </b>
                        A percent attribute that stands for the proportion of impaired watershed within each hexagon. The watershed data are analyzed based on the 12-digit hydrologic unit code (HUC-12) level. Any HUC-12 watershed that contains an Environmental Protection Agency (EPA) 303(d) listed impaired waterbody would be considered impaired (EPA 1972).
                    </p>
                    <p>
                        <b>7. Hydrologic Response to Land-Use Change- </b>
                        The magnitude of change in peak flow due to Land-Use/Land-Cover change from 1996 to 2016, analyzed at the HUC-12 watershed scale (Shamaskin, dissertation, in press). The magnitude of peak flow change is categorized in the following way under the default value system: 0, Very Significant (10-50% increase); 0.25, Significant (5-10% increase); 0.5, Moderate (1-5% increase); 0.75, Minimal (0-1% increase); 1, No Change or Decrease (0% or lower). Watersheds comprised of 90% or more of open water were excluded from analysis.
                    </p>
                    <p>
                        <b>8. Lateral Connectivity of Floodplain- </b>
                        The proportion of floodplain within the area of interest that is connected (or disconnected if using negative utility function), using the Environmental Protection Agency’s (EPA) 100-year floodplain and a measure of relative floodplain inundation frequency derived from Landsat imagery (Allen 2016).
                    </p>
                    <p>
                        <b>9. Percent Irrigated Agriculture- </b>
                        The proportion (%) of the area of interest that is covered by irrigated agriculture, according to the 2017 version of the Moderate Resolution Imaging Spectroradiometer (MODIS) Irrigated Agriculture Dataset for the United States (Pervez and Brown 2010).
                    </p>
                    <p>
                        <b>10. Composition of Riparian Zone Lands- </b>
                        An average index value of the composition of lands within a 100-meter buffer of streams. The index score was calculated by first organizing the Land-Use/Land-Cover (LULC) classes from NLCD 2016 into three tiers: 1) Developed, 2) Agricultural, and 3) Natural (Table 9). Then, after aggregating the combined area of the LULC classes within each tier, the index score in each hexagon was calculated using Equation 8 below. Conversely, if the desired utility is to value more disturbed riparian area, then the index score is calculated using Equation 9 below.
                    </p>
                    <p>
                        <b>11. Vulnerable Areas of Terrestrial Endemic Species- </b>
                        This measure represents the ratio of endemic species to the amount of protected land in the contiguous U.S. The endemic taxa considered are mammals, birds, amphibians, reptiles, freshwater fish, and trees. A score of 0 represents the least vulnerable areas (low priority for conservation). A score of 10 represents the most vulnerable areas (high priority for conservation).
                    </p>
                    <p>
                        <b>12. T&E Species – Critical Habitat Area- </b>
                        The measure is based on the U.S. Fish and Wildlife Service designated federally threatened and endangered (T&E) critical habitat (USFWS 2018b). The value in each hexagon is the cumulative percent (%) area of critical habitats for all T&E species.
                    </p>
                    <p>
                        <b>13. T&E – Number of Species- </b>
                        This attribute measures the number of federally threatened and endangered (T&E) species that have habitat ranges identified within each hexagon.
                    </p>
                    <p>
                        <b>14. Light Pollution Index- </b>
                        An index that measures the intensity of light pollution within each hexagon. A score of zero indicates that the sky above the hexagon is already polluted/bright, and a score of above 0 to 1 indicates light pollution (LP) in decreasing order.
                    </p>
                    <p>
                        <b>15. National Register of Historic Places- </b>
                        A numeric attribute that represents the counts of historic places within each hexagon. The data is based on U.S. NPS National Register of Historic Places.
                    </p>
                    <p>
                        <b>16. National Heritage Area- </b>
                        A percent attribute that stands for the proportion of heritage area within each hexagon. The Heritage data is based on the NPS National Heritage Area layer.
                    </p>
                    <p>
                        <b>17. Proximity to Socially Vulnerable Communities- </b>
                        This measure indicates the proximity to communities that are socially vulnerable according to the National Oceanic and Atmospheric Administration’s (NOAA) Social Vulnerability Index. This is a binary attribute that represents the spatial relationship between a hexagon and areas that have been identified by NOAA as having medium or higher social vulnerability. Any area of interest that directly intersects or is within a 1 hex (1 km2) distance of a socially vulnerable community would score a 1, and areas of interest not within a 1 km2 distance of a socially vulnerable community would score a 0.
                    </p>
                    <p>
                        <b>18. Community Threat Index- </b>
                        The Community Threat Index (CTI) comes from the Coastal Resilience Evaluation and Siting Tool (CREST), by the National Fish and Wildlife Foundation (NFWF) in collaboration with National Oceanic and Atmospheric Administration (NOAA), U.S. Army Corps of Engineers (USACE), and NatureServe (NFWF et al. 2019) and includes datasets that show coastal flood and severe storm hazards on the landscape. The CTI is a raster based model (30 × 30 meters) with a cumulative scoring of inputs, which include: storm surge scenarios, sea level rise scenarios, flood prone areas, soil erodibility, impermeable soils, areas of low slope, and geologic stressors (i.e., landslide susceptibility and land subsidence).
                    </p>
                    <p>
                        <b>19. High Priority Working Lands- </b>
                        The percentage area of pine, cropland, and pasture/hay classes from the National Land Cover Database (NLCD) 2016 classification map (Yang et al. 2018) excluding the areas that are already protected according to the Protected Areas Database of the United States (PAD-US) 2.0 (Gergeley 2016).
                    </p>
                    <p>
                        <b>20. Commercial Fishing Reliance- </b>
                        Commercial fishing reliance measures the presence of commercial fishing through fishing activity as shown through permits and vessel landings relative to the population of a community. A high rank indicates more reliance.
                    </p>
                    <p>
                        <b>21. Recreational Fishing Engagement- </b>
                        Recreational fishing engagement measures the presence of recreational fishing through fishing activity estimates, including charter fishing pressure, private fishing pressure, and shore fishing pressure. A high rank indicates more engagement.
                    </p>
                    <p>
                        <b>22. Access & Recreation - Number of Access Points- </b>
                        This measure indicates the number of points within a 25 km buffer radius of a hexagon, where the public can access places to engage in outdoor recreation, including boat ramps and access points to parks, wildlife management areas, wildlife refuges, and National Estuarine Research Reserves.
                    </p>
                </div>
                <br/>
                <h4>References Cited:</h4>
                <div>
                    <p>
                        1. U.S. Geological Survey (USGS) Gap Analysis Project (GAP), 2018, Protected Areas Database of the United State (PAD-US): U.S. Geological Survey data release, https://doi.org/10.5066/P955KPLE.↩︎
                    </p>
                    <p>
                        2. https://sciencebase.gov/catalog/item/56290d6de4b0d158f5926cd2.↩︎
                    </p>
                    <p>
                        3. https://databasin.org/datasets/d0fc5db660524489a0f369e7c3d7e3f1.↩︎
                    </p>
                    <p>
                        4. Jenkins, CN, KS Van Houtan, SL Pimm, JO Sexton (2015) US protected lands mismatch biodiversity priorities. PNAS 112(16), pp.5081-5086.↩︎
                    </p>
                </div>
            </div>
        </div>
    )
};

export default Appendix;
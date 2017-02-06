/**
 * RoutesInterface
 * 
 * Interface for routes configuration
 * 
 * @author Gustavo Vilas Boas
 * @since 12/2016
 */
export interface RoutesInterface {
    route: string;
    controller: string;
    function: string;
    method?: string;
    is_public?: boolean;
};

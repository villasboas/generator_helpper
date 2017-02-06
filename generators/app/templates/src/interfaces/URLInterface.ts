/**
 * URLInterface
 * 
 * Interface for URL params
 * 
 * @author Henrique de Castro
 * @since 12/2016
 */
export interface URLInterface {
    controller: string;
    function: string;
    params: Array<any>;
};

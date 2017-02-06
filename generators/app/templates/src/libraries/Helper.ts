import * as fs   from 'fs';
import * as path from 'path';

/**
 * Helper
 * 
 * An static class with commouns methods
 * 
 * @author Gustavo Vilas Boas
 * @since 12/2016
 */
export default class Helper {

    /**
     * getDirectories
     * 
     * get all directories of a path
     * 
     * @param {string} srcpath path where to get all directores from
     * @return {Array<string>} an array with de directories names
     */
    public static getDirectories(src_path: string): Array<string> {

        // read all files from the path
        src_path = path.resolve(__dirname, src_path);
        return fs.readdirSync(src_path).filter(file => {

            // check if current item is a directory
            return fs.statSync(path.join(src_path, file)).isDirectory();
        });
    }

    /**
     * getFiles
     * 
     * get all files from a directory
     * 
     * @param {string} srcpath path where to get all files from
     * @param {Array<string>} remove_ext extension to remove
     * @return {Array<string>} an array with de files names
     */
    public static getFiles(src_path: string, remove_ext?: Array<string>): Array<string> {

        // read all files from the path
        src_path = path.resolve(__dirname, src_path);
        let files = fs.readdirSync(src_path).filter( file => {

            // check if current item is a file
            return !fs.statSync(path.join(src_path, file)).isDirectory();
        });

        // remove extension?
        if (remove_ext) {
            files = files.map((value) => {

                for (let item of remove_ext)
                    value = value.replace(`.${item}`, '');
                return value.replace(`.${remove_ext}`, '');
            });
        }

        // return the files
        return files;
    }
};

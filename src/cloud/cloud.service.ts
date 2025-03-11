import { Post } from '@nestjs/common';
import * as moment from 'moment';
import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { SQL } from 'src/database/sql.sql';
import { __CLOUD_PATH } from 'src/config/config.config';

@Injectable()
export class CloudService {
  private readonly baseDir = path.join(__dirname, __CLOUD_PATH);
  constructor(

  ) {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  //--------------------------------------------
  createFolder(folderPath: string): string {
    if (!folderPath) {
      throw new BadRequestException('Folder path must be provided.');
    }

    const fullPath = path.join(this.baseDir, folderPath);
    if (fs.existsSync(fullPath)) {
      throw new BadRequestException(`Folder '${folderPath}' already exists.`);
    }

    // Create the nested folder structure if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });
    return `Folder '${folderPath}' created successfully.`;
  }

  // Create a new file within a folder
  createFile(folderPath: string, fileName: string, content: string): string {
    const fullFolderPath = path.join(this.baseDir, folderPath);

    // Ensure the folder exists before creating the file
    if (!fs.existsSync(fullFolderPath)) {
      throw new BadRequestException(`Folder '${folderPath}' does not exist in the drive.`);
    }

    const filePath = path.join(fullFolderPath, fileName);

    // Write content to the file
    fs.writeFileSync(filePath, content);
    return `File '${fileName}' created in folder '${folderPath}' successfully.`;
  }

  // List files in a specific folder
  listFiles(folderPath: string): string[] {
    const fullFolderPath = path.join(this.baseDir, folderPath);
    if (!fs.existsSync(fullFolderPath)) {
      throw new BadRequestException(`Folder '${folderPath}' does not exist.`);
    }

    return fs.readdirSync(fullFolderPath).filter(file => {
      return fs.statSync(path.join(fullFolderPath, file)).isFile();
    });
  }

  // Retrieve all folders inside the base directory
  getAllFolders(): string[] {
    const folders = fs.readdirSync(this.baseDir).filter(file =>
      fs.statSync(path.join(this.baseDir, file)).isDirectory()
    );
    return folders;
  }

  // Save uploaded file to a specific folder
  uploadFile(folderName: string, file: Express.Multer.File): string {
    if (!folderName) {
      throw new BadRequestException('Folder name must be provided.');
    }
    if (!file) {
      throw new BadRequestException('File must be provided.');
    }

    const folderPath = path.join(this.baseDir, folderName);
    if (!fs.existsSync(folderPath)) {
      throw new BadRequestException(`Folder '${folderName}' does not exist.`);
    }

    const filePath = path.join(folderPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    return `File '${file.originalname}' uploaded successfully to folder '${folderName}'.`;
  }

  // Method to get all files and folders recursively
  private getAllItems(dirPath: string): any[] {
    const items = fs.readdirSync(dirPath);
    let results = [];

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        results.push({
          name: item,
          path: itemPath,
          type: 'folder',
          size: this.calculateFolderSize(itemPath),
          lastModified: stats.mtime,
        });
        // Recursively add subfolder items
        results = results.concat(this.getAllItems(itemPath));
      } else {
        results.push({
          name: item,
          path: itemPath,
          type: 'file',
          size: stats.size,
          lastModified: stats.mtime,
        });
      }
    });

    return results;
  }

  // Calculate folder size
  private calculateFolderSize(dirPath: string): number {
    let totalSize = 0;
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        totalSize += this.calculateFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    });

    return totalSize;
  }
  // Search both files and folders
  public searchItems(searchTerm: string): any[] {
    const allItems = this.getAllItems(this.baseDir);
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Helper function to recursively get all files
  private getAllFiles(dirPath: string, filesArray: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        this.getAllFiles(filePath, filesArray);
      } else {
        filesArray.push(filePath.replace(this.baseDir + path.sep, ''));
      }
    });

    return filesArray;
  }

  // Retrieve the drive structure in a hierarchical format
  getDriveStructure(): any {
    return this.buildStructure(this.baseDir);
  }

  // Helper function to recursively build the structure
  private buildStructure(dirPath: string): any {
    const items = fs.readdirSync(dirPath);
    const structure = [];

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        structure.push({
          name: item,
          type: 'folder',
          size: this.calculateFolderSize(itemPath), // Calculate folder size recursively
          lastModified: stats.mtime, // Last modified date
          subfolder: this.buildStructure(itemPath), // Recursive call for subfolders
        });
      } else {
        structure.push({
          name: item,
          type: 'file',
          size: stats.size, // File size in bytes
          lastModified: stats.mtime, // Last modified date
        });
      }
    });

    return structure;
  }

  // Delete a specific file in a folder
  deleteFile(folderPath: string): string {
    if (!folderPath) {
      throw new BadRequestException('Folder name and file name must be provided.');
    }

    const filePath = path.join(this.baseDir, folderPath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File  does not exist in folder '${folderPath}'.`);
    }

    fs.unlinkSync(filePath);
    return `File  deleted successfully from folder '${folderPath}'.`;
  }

  // Delete an entire folder and its contents
  deleteFolder(folderPath: string): string {
    if (!folderPath) {
      throw new BadRequestException('Folder name must be provided.');
    }

    const folderToDelete = path.join(this.baseDir, folderPath);
    if (!fs.existsSync(folderToDelete)) {
      throw new NotFoundException(`Folder '${folderPath}' does not exist.`);
    }
    fs.rmSync(folderToDelete, { recursive: true, force: true });
    return `Folder '${folderPath}' and its contents deleted successfully.`;
  }

  // Download a specific file from a folder
  downloadFile(folderPath: string): StreamableFile {
    if (!folderPath) {
      throw new BadRequestException('Folder name and file name must be provided.');
    }

    const filePath = path.join(this.baseDir, folderPath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File  does not exist in folder '${folderPath}'.`);
    }

    const file = fs.createReadStream(filePath);
    return new StreamableFile(file);
  }

  // Download an entire folder as a zip file
  async downloadFolder(folderPath: string): Promise<StreamableFile> {
    if (!folderPath) {
      throw new BadRequestException('Folder name must be provided.');
    }

    const folderToZip = path.join(this.baseDir, folderPath);
    if (!fs.existsSync(folderToZip)) {
      throw new NotFoundException(`Folder '${folderPath}' does not exist.`);
    }

    const zipFileName = `${folderPath.replace(/\//g, '_')}.zip`;
    const zipFilePath = path.join(this.baseDir, zipFileName);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip');

    return new Promise((resolve, reject) => {
      archive.pipe(output);
      archive.directory(folderToZip, false);
      archive.finalize();

      output.on('close', () => {
        const zipFileStream = fs.createReadStream(zipFilePath);
        resolve(new StreamableFile(zipFileStream));
      });

      archive.on('error', (err) => {
        reject(err);
      });
    });
  }
  // Rename a file or folder
  rename(oldPath: string, newName: string): void {
    const fullOldPath = path.join(this.baseDir, oldPath);
    const fullNewPath = path.join(this.baseDir, path.dirname(oldPath), newName);

    if (!fs.existsSync(fullOldPath)) {
      throw new NotFoundException('File or folder does not exist');
    }

    fs.renameSync(fullOldPath, fullNewPath);

  }

  //--------------------------------------------
}
